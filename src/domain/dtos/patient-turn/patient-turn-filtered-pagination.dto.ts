import { ApiProperty } from '@nestjs/swagger';
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
import { PaginationDto } from '../../../common/dtos';
import { Filter } from '../../../common/util/dynamic-query-builder.util';
import { TransformQueryBoolean } from '../../../common/util/custom-dto-properties-decorators/transform-boolean-decorator.util';
import { Gender } from '../../../domain/enums';

export class PatientTurnPaginationDto extends PaginationDto implements Filter {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'Fracción o nombre completo del paciente',
    example: 'Pedro'
  })
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'Fracción o nombre completo del paciente',
    example: 'Martinez'
  })
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    description:
      'Fracción o número completo de identificación de la persona (dni-pasaporte)',
    example: '21754982'
  })
  dni?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    description: 'Genéro del paciente, búsqueda exacta'
  })
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Fecha de nacimiento del paciente, búsqueda exacta',
    example: '1998-10-22'
  })
  birth?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Id de la obra social del paciente, búsqueda exacta',
    example: 'e1f40389-83fd-486f-a244-fc47c1f0ee6c'
  })
  socialWorkId?: string;

  @IsBoolean()
  @TransformQueryBoolean('isDisabled')
  @IsOptional()
  @ApiProperty({
    description:
      'Valor booleano (true o false) que indique si el paciente posee una discapacidad, búsqueda exacta'
  })
  isDisabled?: boolean;
}
