import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dtos';
import { Filter } from '../../../common/util/dynamic-query-builder.util';
import { Role } from '../../enums';

export class UserPaginationDto extends PaginationDto implements Filter {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Fracción o email completo del usuario',
    example: 'juan@example.com'
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Fracción o username completo del usuario',
    example: 'juan123'
  })
  username?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST]
  })
  role?: Role;
}
