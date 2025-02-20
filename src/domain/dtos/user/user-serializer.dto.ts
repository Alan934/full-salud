import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Gender, Role, DocumentType } from '../../../domain/enums';
import { SerializerShortImageBaseDto } from '..';
import { IsOptional } from 'class-validator';

export class SerializerUserDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'juan@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password1234' })
  password: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  gender: Gender;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  birth: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  documentType: DocumentType;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  dni: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  phone: string;

  @ApiProperty({
    example: Object.values(Role).join(' | ')
  })
  role: Role;
}

export class SerializerShortUserDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;
}
