import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstitutionTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Diagnostico por imagenes' })
  type: string;
}
export class UpdateInstitutionTypeDto extends PartialType(
  CreateInstitutionTypeDto
) {}
