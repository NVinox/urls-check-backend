import { Expose } from 'class-transformer';

export class ResponseJobDTO {
  @Expose()
  id!: number;

  @Expose()
  jobId!: string;

  @Expose()
  status!: string;

  @Expose()
  urlCount!: number;

  @Expose()
  successCount!: number;

  @Expose()
  errorCount!: number;
}
