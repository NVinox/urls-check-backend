import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import axios from 'axios';

import { UrlEntity } from './entities/url.entity';
import { JobEntity } from 'src/job/entities/job.entity';

import { EUrlStatus } from 'src/enums/EUrlStatus.enum';
import { MAX_REQUEST_TIMEOUT } from 'src/utils/constants.utils';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  create(url: string, job: JobEntity, manager: EntityManager): UrlEntity {
    return manager.create(UrlEntity, { url, job });
  }

  async getUrlsByJob(jobUuid: string): Promise<UrlEntity[]> {
    return await this.urlRepository.find({
      where: { job: { jobId: jobUuid } },
    });
  }

  async saveMany(
    urls: UrlEntity[],
    manager: EntityManager,
  ): Promise<UrlEntity[]> {
    return await manager.save(UrlEntity, urls);
  }

  async checkUrl(urlEntity: UrlEntity, signal: AbortSignal): Promise<void> {
    const startedAt = new Date();
    const startTimeStamp = performance.now();

    urlEntity.startedAt = startedAt;
    urlEntity.status = EUrlStatus.IN_PROGRESS;

    try {
      await this.urlRepository.save(urlEntity);

      const response = await axios.head(urlEntity.url, {
        timeout: MAX_REQUEST_TIMEOUT,
        signal,
      } as any);

      urlEntity.statusCode = response.status;
      urlEntity.status = EUrlStatus.SUCCESS;
    } catch (err: any) {
      if (signal.aborted || err.name === 'AbortError') {
        urlEntity.status = EUrlStatus.CANCELLED;
        urlEntity.statusCode = null;
        urlEntity.errorMessage = 'The check was cancelled by the user';
      } else {
        urlEntity.status = EUrlStatus.ERROR;
        urlEntity.statusCode = err.response?.status || null;
        urlEntity.errorMessage = err.message;
      }
    } finally {
      const finishedAt = new Date();
      urlEntity.finishedAt = finishedAt;
      urlEntity.duration = Math.round(performance.now() - startTimeStamp);

      await this.urlRepository.save(urlEntity);
    }
  }

  async getUrlsStatusByJob(
    jobId: string,
  ): Promise<{ successCount: number; errorCount: number }> {
    const urls = await this.urlRepository.find({
      where: { job: { jobId } },
    });

    const successCount = urls.filter(
      (u) => u.status === EUrlStatus.SUCCESS,
    ).length;
    const errorCount = urls.filter((u) => u.status === EUrlStatus.ERROR).length;

    return { successCount, errorCount };
  }
}
