import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto } from 'src/common/dtos';

export class SerializerMedicineDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Ibuprofeno', description: 'Nombre del medicamento' })
  medicine: string;
}
