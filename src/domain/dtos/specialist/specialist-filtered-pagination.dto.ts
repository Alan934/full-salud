import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination-common.dto';
import { Filter } from 'src/common/util/dynamic-query-builder.util';
import { TransformQueryBoolean } from 'src/common/util/custom-dto-properties-decorators/transform-boolean-decorator.util';
import { Gender } from 'src/domain/enums';

export class SpecialistFilteredPaginationDto
  extends PaginationDto
  implements Filter
{
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  license?: string;

  @IsBoolean()
  @TransformQueryBoolean('homeService')
  @IsOptional()
  homeService?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlphanumeric()
  dni?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birth?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  degree?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  speciality?: string;

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  socialWorkId?: string;
}
