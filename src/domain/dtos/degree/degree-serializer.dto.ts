import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';

export class SerializerDegreeDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Doctor' })
  degree: string;
}
