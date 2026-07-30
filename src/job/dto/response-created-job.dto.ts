import { Expose } from 'class-transformer';

export class ResponseCreatedJobDTO {
  @Expose()
  jobId!: string;
}
