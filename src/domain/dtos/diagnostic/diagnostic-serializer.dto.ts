import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';

export class SerializerDiagnosticDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Asma' })
  name: string;
}
