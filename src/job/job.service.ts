import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { JobEntity } from './entities/job.entity';

import { UrlService } from 'src/url/url.service';

import { CreateJobDTO } from './dto/create-job.dto';
import { EJobStatus } from 'src/enums/EJobStatus.enum';
import { ResponseCreatedJobDTO } from './dto/response-created-job.dto';
import { UrlEntity } from 'src/url/entities/url.entity';

@Injectable()
export class JobService {
  // private activeJobs = new Map<string, AbortController>();
  private activeJobs = new Map<
    string,
    {
      controller: AbortController;
      donePromise: Promise<void>;
    }
  >();

  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    private readonly urlService: UrlService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateJobDTO): Promise<ResponseCreatedJobDTO> {
    const jobId = uuidv4().substring(0, 35);
    let savedUrlEntities: UrlEntity[] = [];

    try {
      await this.dataSource.transaction(async (manager) => {
        const job = manager.create(JobEntity, {
          jobId,
          status: EJobStatus.PENDING,
          errorCount: 0,
          successCount: 0,
          urlCount: dto.urls.length,
        });
        await manager.save(JobEntity, job);

        const createdUrls = dto.urls.map((url) =>
          this.urlService.create(url, job, manager),
        );
        savedUrlEntities = await this.urlService.saveMany(createdUrls, manager);
      });

      const abortController = new AbortController();

      const donePromise = this.runJob(
        jobId,
        savedUrlEntities,
        abortController.signal,
      );

      this.activeJobs.set(jobId, {
        controller: abortController,
        donePromise,
      });

      this.runJob(jobId, savedUrlEntities, abortController.signal);

      return { jobId };
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        'Failed to create the task on the server',
      );
    }
  }

  async getAll(): Promise<JobEntity[]> {
    try {
      return await this.jobRepository.find({ order: { id: 'DESC' } });
    } catch (err: unknown) {
      throw new InternalServerErrorException();
    }
  }

  async getJob(uuid: string): Promise<JobEntity> {
    const job = await this.jobRepository.findOne({
      where: { jobId: uuid },
      relations: { urls: true },
      order: {
        urls: {
          id: 'ASC',
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with uuid=${uuid}`);
    }

    return job;
  }

  async delete(uuid: string): Promise<boolean> {
    const job = await this.jobRepository.findOneBy({ jobId: uuid });

    if (!job) {
      throw new NotFoundException(`Job with uuid=${uuid} not found`);
    }

    if (job.status !== EJobStatus.IN_PROGRESS) {
      throw new BadRequestException(`Job with uuid=${uuid} completed`);
    }

    const activeJob = this.activeJobs.get(uuid);

    if (activeJob) {
      activeJob.controller.abort();

      await activeJob.donePromise;
    }

    return true;
  }

  private async runJob(
    jobId: string,
    urlEntities: UrlEntity[],
    signal: AbortSignal,
  ): Promise<void> {
    try {
      await this.jobRepository.update(
        { jobId },
        { status: EJobStatus.IN_PROGRESS },
      );

      if (signal.aborted) {
        await this.updateJobStates(jobId, EJobStatus.CANCELLED);
        return;
      }

      await Promise.all(
        urlEntities.map((urlEntity) =>
          this.urlService.checkUrl(urlEntity, signal),
        ),
      );

      if (signal.aborted) {
        await this.updateJobStates(jobId, EJobStatus.CANCELLED);
        return;
      }

      await this.updateJobStates(jobId);
    } catch (error) {
      await this.updateJobStates(jobId, EJobStatus.CANCELLED);
    } finally {
      this.activeJobs.delete(jobId);
    }
  }

  private async updateJobStates(
    uuid: string,
    status = EJobStatus.COMPLETED,
  ): Promise<void> {
    const { successCount, errorCount } =
      await this.urlService.getUrlsStatusByJob(uuid);

    await this.jobRepository.update(
      { jobId: uuid },
      {
        status,
        successCount,
        errorCount,
      },
    );
  }
}
