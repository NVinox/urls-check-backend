import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { JobService } from './job.service';

import { ResponseJobDTO } from './dto/response-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getAll(): Promise<ResponseJobDTO[]> {
    const jobs = await this.jobService.getAll();

    return plainToInstance(ResponseJobDTO, jobs, {
      excludeExtraneousValues: true,
    });
  }
}
