import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from 'src/common/dtos';
import { SerializerShortTagDto } from '..';

export class SerializerSpecialityDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @ApiProperty({ example: true })
  canPrescribe: boolean;

  @Expose()
  @Type(() => SerializerShortTagDto)
  tags: SerializerShortTagDto[];
}

export class SerializerShortSpecialityDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @ApiProperty({ example: true })
  canPrescribe: boolean;
}
