import { Type } from 'class-transformer';
import { DocumentType, Gender } from '../../enums';
import {
  IsAlphanumeric,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'David' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'Peréz' })
  lastName: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY]
  })
  gender: Gender;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2000-08-21' })
  birth: Date;

  @IsNotEmpty()
  @IsEnum(DocumentType)
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType: DocumentType;

  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni: string;

  //recibe un id de un usuario ya creado
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  user?: ShortBaseDto;
}

//no permite actualizar fecha de nacimiento ni user
export class UpdatePersonDto extends PartialType(
  OmitType(CreatePersonDto, ['birth', 'user'] as const)
) {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  id?: string;
}
