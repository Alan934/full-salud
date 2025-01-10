import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Gender, DocumentType } from '../../../domain/enums';
import { CreateUserApplicationDto } from '../user-application/user-application.dto';

export class CreateSpecialistApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  applicationNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Pepe' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Perez' })
  lastName: string;

  @IsNotEmpty()
  @IsEnum(DocumentType)
  @ApiProperty({ example: DocumentType.DNI })
  documentType: DocumentType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456' })
  dni: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({ example: Gender.MALE })
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1990-01-01' })
  birth: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '714d0733-eb06-4ff5-816f-c5399827a9c0' })
  degreeId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '714d0733-eb06-4ff5-816f-c5399827a9c0' })
  specialityId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserApplicationDto)
  @ApiProperty({ type: CreateUserApplicationDto })
  userApplication: CreateUserApplicationDto;
}

export class UpdateSpecialistApplicationDto extends PartialType(
  CreateSpecialistApplicationDto
) {}
