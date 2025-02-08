import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateMedicationDto } from '../medication/Medication.dto';

export class CreateMedicationRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Tomar una cápsula cada 8 horas por 7 días.' })
  indications: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Infección respiratoria.' })
  diagnosis: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  isValidSignature: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  practitionerId: string; 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  patientId: string; 

  @IsNotEmpty()
  @ApiProperty({ type: [CreateMedicationDto] })
  medicines: CreateMedicationDto[]; 
}

export class UpdateMedicationRequestDto extends PartialType(CreateMedicationRequestDto) {}
