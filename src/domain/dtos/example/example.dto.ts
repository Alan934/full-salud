import { PartialType } from '@nestjs/swagger';

export class CreateExampleDto {}

export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
