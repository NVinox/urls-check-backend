import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUrl,
} from 'class-validator';
import { MAX_URLS_SIZE } from 'src/utils/constants.utils';

export class CreateJobDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_URLS_SIZE)
  @ArrayUnique()
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      each: true,
    },
  )
  urls!: string[];
}
