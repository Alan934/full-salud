import { IsNotEmpty, IsString, IsDate, ValidateNested } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Express } from 'express';
import 'multer';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateDisabilityCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456789' })
  cardNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  expirationDate: Date;

  //recibe el id del PacietTurn con el que se relaciona
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @ApiProperty({ type: ShortBaseDto })
  patientTurn: ShortBaseDto;
}

export class UpdateDisabilityCardDto extends PartialType(
  CreateDisabilityCardDto
) {}

export class CreateDisabilityCardDtoWithFiles {
  @ValidateNested()
  @Type(() => CreateDisabilityCardDto)
  @ApiProperty({ type: CreateDisabilityCardDto })
  disabilityCard?: CreateDisabilityCardDto;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Imágenes de carnet de discapacidad en formato PNG, JPG o JPEG'
  })
  disabilityCardImages?: Express.Multer.File[];
}
