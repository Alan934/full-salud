import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class FilteredMedicationDto {
  @ApiPropertyOptional({ example: 'Paracetamol', description: 'Nombre del medicamento' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Límite de resultados por página' })
  @IsOptional()
  @IsInt()
  limit?: number;
}