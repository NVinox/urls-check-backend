import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { JobService } from './job.service';

import { ResponseJobDTO } from './dto/response-job.dto';
import { ResponseCreatedJobDTO } from './dto/response-created-job.dto';
import { CreateJobDTO } from './dto/create-job.dto';
import { ResponseJobOneDTO } from './dto/response-job-one';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() dto: CreateJobDTO): Promise<ResponseCreatedJobDTO> {
    const job = await this.jobService.create(dto);

    return plainToInstance(ResponseCreatedJobDTO, job, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getAll(): Promise<ResponseJobDTO[]> {
    const jobs = await this.jobService.getAll();

    return plainToInstance(ResponseJobDTO, jobs, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':uuid')
  async getJob(@Param('uuid') uuid: string): Promise<ResponseJobOneDTO> {
    const job = await this.jobService.getJob(uuid);

    return plainToInstance(ResponseJobOneDTO, job, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string): Promise<boolean> {
    return await this.jobService.delete(uuid);
  }
}
