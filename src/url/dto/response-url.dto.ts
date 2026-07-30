import { Expose } from 'class-transformer';

export class ResponseUrlDTO {
  @Expose()
  id!: number;

  @Expose()
  url!: string;

  @Expose()
  status!: string;

  @Expose()
  statusCode!: number | null;

  @Expose()
  errorMessage!: string | null;

  @Expose()
  startedAt!: Date | null;

  @Expose()
  finishedAt!: Date | null;

  @Expose()
  duration!: number | null;

  @Expose()
  jobId!: number;
}
