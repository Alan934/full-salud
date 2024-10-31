import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerIvaDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'General' })
  type: string;
}
