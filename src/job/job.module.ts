import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './job.controller';
import { JobService } from './job.service';

import { JobEntity } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
