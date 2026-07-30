import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EUrlStatus } from 'src/enums/EUrlStatus.enum';

export class CreateUrlDTO {
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EUrlStatus)
  status!: EUrlStatus;

  @IsOptional()
  @IsInt()
  statusCode!: number | null;

  @IsOptional()
  @IsString()
  errorMessage!: string | null;

  @IsOptional()
  @IsDate()
  startedAt!: Date | null;

  @IsOptional()
  @IsDate()
  finishedAt!: Date | null;

  @IsOptional()
  @IsInt()
  duration!: number | null;

  @IsNotEmpty()
  @IsInt()
  jobId!: number;
}
