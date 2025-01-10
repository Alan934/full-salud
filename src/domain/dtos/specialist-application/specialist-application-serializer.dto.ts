import { Expose, Type } from 'class-transformer';
import { FullBaseDto } from '../../../common/dtos';
import { SerializerUserApplicationDto } from '../user-application/user-application-serializer.dto';
import { Gender, DocumentType } from '../../../domain/enums';
import { ApiProperty } from '@nestjs/swagger';

export class SerializerSpecialistApplicationDto extends FullBaseDto {
  @Expose()
  applicationNumber: number;

  @Expose()
  @ApiProperty({ example: '2615836294' })
  license: string;

  @Expose()
  @ApiProperty({ example: 'Pepe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Perez' })
  lastName: string;

  @Expose()
  documentType: DocumentType;

  @Expose()
  @ApiProperty({ example: '123456' })
  dni: string;

  @Expose()
  gender: Gender;

  @Expose()
  @ApiProperty({ example: '1990-01-01' })
  birth: string;

  @Expose()
  @Type(() => SerializerUserApplicationDto)
  userApplication: SerializerUserApplicationDto;
}
