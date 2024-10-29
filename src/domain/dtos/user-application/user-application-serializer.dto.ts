import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto } from 'src/common/dtos';
import { ApplicationStatus } from 'src/domain/enums';

export class SerializerUserApplicationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @Expose()
  @ApiProperty({
    example: Object.values(ApplicationStatus).join(' | ')
  })
  applicationStatus: ApplicationStatus;
}
