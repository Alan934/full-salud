import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { FullBaseDto } from "src/common/dtos";
import {
  SerializerPatientDto,
  } from '..';
  import { SerializerShortPractitionerDto } from '../practitioner/Practitioner-serializer.dto';
export class SerializerFavoriteDto extends FullBaseDto {
    @Expose()
    @ApiProperty({ example: true })
    enabled: boolean;

    //ver modificar serializerUSerDto a shortIdUserDto
    @Expose()
    @Type(() => SerializerPatientDto)
    patient: SerializerPatientDto

    @Expose()
    @Type(() => SerializerShortPractitionerDto)
    practitioner: SerializerShortPractitionerDto

}
