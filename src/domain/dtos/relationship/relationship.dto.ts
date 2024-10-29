import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRelationshipDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hijo' })
  relation: string;
}

export class UpdateRelationshipDto extends PartialType(CreateRelationshipDto) {}
