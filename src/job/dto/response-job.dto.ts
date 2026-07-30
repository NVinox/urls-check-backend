import { Expose } from 'class-transformer';
import { ResponseCreatedJobDTO } from './response-created-job.dto';

export class ResponseJobDTO extends ResponseCreatedJobDTO {
  @Expose()
  id!: number;

  @Expose()
  status!: string;

  @Expose()
  urlCount!: number;

  @Expose()
  successCount!: number;

  @Expose()
  errorCount!: number;
}
