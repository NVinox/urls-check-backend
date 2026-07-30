import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './job.controller';
import { JobService } from './job.service';

import { UrlModule } from 'src/url/url.module';

import { JobEntity } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity]), UrlModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
