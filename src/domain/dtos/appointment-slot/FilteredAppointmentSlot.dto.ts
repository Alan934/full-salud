import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsString, IsInt } from "class-validator";
import { Day } from "../../../domain/enums";


export class FilteredAppointmentSlotDto {
    @ApiPropertyOptional({
      example: 'MONDAY',
      description: 'Día disponible (ejemplo: MONDAY, TUESDAY, etc.)',
    })
    @IsOptional()
    @IsEnum(Day)
    day?: Day;
  
    @ApiPropertyOptional({ example: '09:00', description: 'Hora de apertura mínima' })
    @IsOptional()
    @IsString()
    openingHour?: string;
  
    @ApiPropertyOptional({ example: '18:00', description: 'Hora de cierre máxima' })
    @IsOptional()
    @IsString()
    closeHour?: string;
  
    @ApiProperty({ example: 1, description: 'Número de página' })
    @IsInt()
    page: number;
  
    @ApiProperty({ example: 10, description: 'Límite de resultados por página' })
    @IsInt()
    limit: number;
  }