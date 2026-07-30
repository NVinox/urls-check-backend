import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UrlService } from './url.service';

import { UrlEntity } from './entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
