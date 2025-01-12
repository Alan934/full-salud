import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender } from '../../enums/gender.enum';
import { DocumentType } from '../../enums/document-type.enum';
import { ShortBaseDto } from '../../../common/dtos';
import { CreateUserDto } from '../user/user.dto';

export class PersonBaseDto {

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'David' })
  name?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Peréz' })
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY],
  })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2000-08-21' })
  birth?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType?: DocumentType;

  @IsOptional()
  @IsString()
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2615836294' })
  phone?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @ApiProperty({ type: [ShortBaseDto] })
  addresses?: ShortBaseDto[];

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
