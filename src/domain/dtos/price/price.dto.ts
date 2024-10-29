import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';

export class CreatePriceDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Type(() => Number)
  @ApiProperty({ example: '8000' })
  price: number;

  //recibe el id del especialista
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  specialist: ShortBaseDto;

  //recibe el id de la practica
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  practice: ShortBaseDto;
}

//no permite actualizar practice ni specialist, solo el price
export class UpdatePriceDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Type(() => Number)
  price: number;
}
