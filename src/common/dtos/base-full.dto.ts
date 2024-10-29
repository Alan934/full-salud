import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FullBaseDto {
  @Expose()
  @ApiProperty({ example: '50436717-8608-4bff-bf41-373f14a8b888' })
  id: string;

  @Expose()
  @ApiProperty({ example: null, nullable: true })
  deletedAt!: Date;

  @Expose()
  @ApiProperty({ example: '2024-08-15 12:50:39.147274' })
  createdAt!: Date;
}
