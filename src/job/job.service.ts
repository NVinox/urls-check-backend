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
  private activeJobs = new Map<string, AbortController>();

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
      this.activeJobs.set(jobId, abortController);

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
      return await this.jobRepository.find();
    } catch (err: unknown) {
      throw new InternalServerErrorException();
    }
  }

  async getUrlsByJob(uuid: string): Promise<UrlEntity[]> {
    const isExistJob = await this.jobRepository.existsBy({ jobId: uuid });

    if (!isExistJob) {
      throw new NotFoundException(`Job with uuid=${uuid}`);
    }

    return await this.urlService.getUrlsByJob(uuid);
  }

  async delete(uuid: string): Promise<boolean> {
    const job = await this.jobRepository.findOneBy({ jobId: uuid });

    if (!job) {
      throw new NotFoundException(`Job with uuid=${uuid}`);
    }

    if (
      job.status !== EJobStatus.IN_PROGRESS ||
      job.status !== EJobStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(`Job with uuid=${uuid} completed`);
    }

    const controller = this.activeJobs.get(uuid);

    if (controller) {
      controller.abort();
      this.activeJobs.delete(uuid);
    }

    return true;
  }

  private async runJob(
    jobId: string,
    urlEntities: UrlEntity[],
    signal: AbortSignal,
  ): Promise<void> {
    await this.jobRepository.update(
      { jobId },
      { status: EJobStatus.IN_PROGRESS },
    );

    await Promise.all(
      urlEntities.map((urlEntity) =>
        this.urlService.checkUrl(urlEntity, signal),
      ),
    );

    if (signal.aborted) {
      await this.jobRepository.update(
        { jobId },
        { status: EJobStatus.CANCALED },
      );
      this.activeJobs.delete(jobId);
      return;
    }

    const { successCount, errorCount } =
      await this.urlService.getUrlsStatusByJob(jobId);

    await this.jobRepository.update(
      { jobId },
      {
        status: EJobStatus.COMPLETED,
        successCount,
        errorCount,
      },
    );

    this.activeJobs.delete(jobId);
  }
}
