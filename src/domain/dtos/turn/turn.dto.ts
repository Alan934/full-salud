import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TurnStatus } from 'src/domain/enums';
import { IsTime } from 'src/common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { IncompatableWith } from 'src/common/util/custom-dto-properties-decorators/validate-incompatible-properties.util';

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
      'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva',
  })
  observation?: string;

  // Recibe el id de patientUserConnection
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  patientUserConnection: ShortBaseDto;

  // Recibe un id de diagnostic
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  diagnostic: ShortBaseDto;

  // Recibe el id del specialist
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @IncompatableWith(['institution'])
  specialist?: ShortBaseDto;

  // Recibe el id de institution
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @IncompatableWith(['specialist'])
  institution?: ShortBaseDto;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Horarios y días que el paciente dispone para el turno',
    example: 'Jueves de 07:00 a 09:00 y Lunes de 12:00 a 15:00',
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
      TurnStatus.UNDER_REVIEW,
    ],
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
    description: 'Imágenes de derivaciones en formato PNG, JPG o JPEG',
  })
  // Cambiado para no usar Express ni Multer
  derivationImages?: { buffer: Buffer; originalname: string }[];
}
