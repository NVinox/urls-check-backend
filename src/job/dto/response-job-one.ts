import { Expose, Type } from 'class-transformer';

import { ResponseJobDTO } from './response-job.dto';
import { ResponseUrlDTO } from 'src/url/dto/response-url.dto';

export class ResponseJobOneDTO extends ResponseJobDTO {
  @Expose()
  @Type(() => ResponseUrlDTO)
  urls!: ResponseJobDTO[];
}
