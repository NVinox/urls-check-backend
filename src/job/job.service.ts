import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JobEntity } from './entities/job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async getAll(): Promise<JobEntity[]> {
    try {
      return await this.jobRepository.find();
    } catch (err: unknown) {
      throw new InternalServerErrorException();
    }
  }
}
