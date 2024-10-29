import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';

export class SerializerRelationshipDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Hijo' })
  relation: string;
}
