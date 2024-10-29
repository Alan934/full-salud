import { PartialType } from '@nestjs/swagger';
import { CreateImageBaseDto } from '..';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProfileImageDto extends CreateImageBaseDto {}

export class UpdateProfileImageDto extends PartialType(CreateProfileImageDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  id?: string;
}
