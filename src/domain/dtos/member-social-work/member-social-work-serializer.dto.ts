import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';
import { SerializerSocialWorkDto } from '..';

export class SerializerMemberSocialWorkDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '12345678' })
  memberNum: string;

  @Expose()
  @ApiProperty({ example: 'A35' })
  plan: string;

  @Expose()
  @Type(() => SerializerSocialWorkDto)
  socialWork?: SerializerSocialWorkDto;
}
