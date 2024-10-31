import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../../../domain/enums';

export class CreateUserApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;
}

export class UpdateUserApplicationDto extends PartialType(
  CreateUserApplicationDto
) {}

export class ChangeStatusApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  @ApiProperty({ example: ApplicationStatus.REJECTED })
  status: ApplicationStatus;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Solicitud rechazada por falta de documentos' })
  reason: string;
}
