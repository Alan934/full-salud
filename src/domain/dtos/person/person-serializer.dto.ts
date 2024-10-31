import { ApiProperty } from '@nestjs/swagger';
import { ShortBaseDto } from '../../../common/dtos';
import { SerializerUserDto } from '..';
import { Gender, DocumentType } from '../../../domain/enums';
import { Expose, Type } from 'class-transformer';

export class SerializerShortPersonDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'David' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Peréz' })
  lastName: string;
}

export class SerializerFullPersonDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'David' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Peréz' })
  lastName: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Gender).join(' | ')
  })
  gender: Gender;

  @Expose()
  @ApiProperty({ example: '2000-08-21' })
  birth: Date;

  @Expose()
  @ApiProperty({ example: Object.values(DocumentType).join(' | ') })
  documentType: DocumentType;

  @Expose()
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni: string;

  @Expose()
  @Type(() => SerializerUserDto)
  user: SerializerUserDto;
}
