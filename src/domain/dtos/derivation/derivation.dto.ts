import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PatientTurn, Practitioner } from '../../../domain/entities';

export class CreateDerivationDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Detalles de la derivación' })
  details: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Cardiología' })
  specialityt: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PatientTurn)
  @ApiProperty({ type: () => PatientTurn })
  patientTurn: PatientTurn;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Practitioner)
  @ApiProperty({ type: () => Practitioner })
  practitioner: Practitioner;
}
export class UpdateDerivationDto extends PartialType(CreateDerivationDto) {}
