import { Expose, Type } from 'class-transformer';
import { FullBaseDto } from 'src/common/dtos';
import { SerializerUserApplicationDto } from '..';

export class SerializerInstitutionApplicationDto extends FullBaseDto {
  @Expose()
  applicationNumber: number;

  @Expose()
  cuit: string;

  @Expose()
  businessName: string;

  @Expose()
  @Type(() => SerializerUserApplicationDto)
  userApplication: SerializerUserApplicationDto;
}
