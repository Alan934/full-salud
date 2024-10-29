import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from 'src/common/dtos';

export class SerializerTagDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Salud Mental' })
  name: string;
}

export class SerializerShortTagDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Salud Mental' })
  name: string;
}
