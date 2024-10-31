import { ShortBaseDto } from '../../../common/dtos';
import { CreatePersonDto, UpdatePersonDto } from '../../../domain/dtos';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreateSpecialistSecretaryDto {
  //recibe una nueva persona
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  //recibe un id de oficina ya creada
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  office: ShortBaseDto;
}

export class UpdateSpecialistSecretaryDto extends PartialType(
  OmitType(CreateSpecialistSecretaryDto, ['person'] as const)
) {
  //recibe opcionalmente una persona actualizada
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdatePersonDto)
  @ApiProperty({
    description:
      'Debe incluir el id de person para el correcto guardado de datos'
  })
  person?: UpdatePersonDto;
}
