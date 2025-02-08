import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { SerializerShortTagDto } from '..';

export class SerializerPractitionerRoleDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @ApiProperty({ example: true })
  canPrescribe: boolean;

  @Expose()
  @Type(() => SerializerShortTagDto)
  tags: SerializerShortTagDto[];
}

export class SerializerShortPractitionerRoleDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @ApiProperty({ example: true })
  canPrescribe: boolean;
}
