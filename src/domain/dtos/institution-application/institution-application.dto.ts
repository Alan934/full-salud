import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { CreateUserApplicationDto } from '../user-application/user-application.dto';
import { Type } from 'class-transformer';

export class CreateInstitutionApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  applicationNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '20-12345678-9' })
  cuit: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ACME Corp' })
  businessName: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserApplicationDto)
  @ApiProperty({ type: CreateUserApplicationDto })
  userApplication: CreateUserApplicationDto;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '4a0865a0-4b82-4c6f-811c-1d0197276a4e' })
  institutionTypeId: string;
}

export class UpdateInstitutionApplicationDto extends PartialType(
  CreateInstitutionApplicationDto
) {}
