import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Express } from 'express';
import 'multer';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TurnStatus } from '../../../domain/enums';
import { IsTime } from '../../../common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { IncompatableWith } from '../../../common/util/custom-dto-properties-decorators/validate-incompatible-properties.util';

export class CreateTurnDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsTime('hour')
  @IsOptional()
  hour?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example:
      'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation?: string;

  //recibe el id de patientUserConnection
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  patientUserConnection: ShortBaseDto;

  //recibe un id de diagnostic
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  diagnostic: ShortBaseDto;

  //recibe el id del specialist
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @IncompatableWith(['institution'])
  specialist?: ShortBaseDto;

  //recibe el id de institution
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @IncompatableWith(['specialist'])
  institution?: ShortBaseDto;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Horarios y días que el paciente dispone para el turno',
    example: 'Jueves de 07:00 a 09:00 y Lunes de 12:00 a 15:00'
  })
  availableTime: string;
}

export class UpdateTurnDto extends PartialType(CreateTurnDto) {
  @IsOptional()
  @IsEnum(TurnStatus)
  @ApiProperty({
    examples: [
      TurnStatus.APPROVED,
      TurnStatus.CANCELLED,
      TurnStatus.COMPLETED,
      TurnStatus.NO_SHOW,
      TurnStatus.PENDING,
      TurnStatus.UNDER_REVIEW
    ]
  })
  status?: TurnStatus;
}

export class CreateTurnDtoWithFiles {
  @ValidateNested()
  @Type(() => CreateTurnDto)
  @ApiProperty({ type: CreateTurnDto })
  turn?: CreateTurnDto;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Imagénes de derivaciones en formato PNG, JPG o JPEG'
  })
  derivationImages?: Express.Multer.File[];
}
