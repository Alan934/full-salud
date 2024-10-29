import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos';
import { Filter } from 'src/common/util/dynamic-query-builder.util';
import { Role } from 'src/domain/enums';

export class UserPaginationDto extends PaginationDto implements Filter {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '2615836294' })
  phone?: string;

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
