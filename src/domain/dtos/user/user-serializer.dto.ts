import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Role } from '../../../domain/enums';
import { SerializerShortImageBaseDto } from '..';

export class SerializerUserDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  username: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Role).join(' | ')
  })
  role: Role;

  @Expose()
  @Type(() => SerializerShortImageBaseDto)
  profileImage?: SerializerShortImageBaseDto;
}

export class SerializerShortUserDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;
}
