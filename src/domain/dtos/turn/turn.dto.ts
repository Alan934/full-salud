import {
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
import { CreateAttentionHourPatientDto } from '../attention-hour-patient/attention-hour-patient.dto';
import { CreateSpecialistDto } from '../specialist/specialist.dto';

export class CreateTurnDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  date?: string;

  @IsOptional()
  hour?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAttentionHourPatientDto)
  attentionHourPatient?: CreateAttentionHourPatientDto[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation?: string;

  // @IsNotEmpty()
  // @ValidateNested()
  // @Type(() => ShortBaseDto)
  // patient: ShortBaseDto;

  // @IsNotEmpty()
  // //@ValidateNested()
  // patientId: string; // Cambiado de patient a patientId

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '20a05b0e-d872-4fe5-bf9f-4b6b010b443d' })
  patientId: string; // Usamos solo el ID

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @ApiProperty({
    example: [{ id: '7c715f1e-09b9-4138-814a-00959681b541' }],
    type: [ShortBaseDto],
  })
  specialists: ShortBaseDto[];

  // @ValidateNested({ each: true })
  // @IsNotEmpty()
  // @Type(() => ShortBaseDto)
  // specialists: ShortBaseDto[];


  // @ValidateNested({ each: true })
  // @IsNotEmpty()
  // @Type(() => ShortBaseDto)
  // specialists: ShortBaseDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  diagnostic?: ShortBaseDto;
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
