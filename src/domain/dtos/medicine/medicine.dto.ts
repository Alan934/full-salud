import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Ibuprofeno', description: 'Nombre del medicamento' })
  medicine: string;
}

export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {}
