import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Su turno para Dermatología está en revisión' })
  text: string;

  //recibe el id del usuario
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  user?: ShortBaseDto;
}

export class UpdateNotificatioDto extends PartialType(
  OmitType(CreateNotificationDto, ['user'] as const)
) {}
