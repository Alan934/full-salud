import { Role } from '../../enums/role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { Express } from 'express';
import 'multer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { OmitFieldForRoles } from '../../../common/util/custom-dto-properties-decorators/validate-omit-field-for-roles.util';
import { IsOptionalIf } from '../../../common/util/custom-dto-properties-decorators/validate-is-optional-if-decorator.util';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateUserDto {
  // @IsNumberString()
  // @IsOptionalIf((dto) => dto.role == Role.SECRETARY)
  // //phone no es pasado cuando se crea secretary
  // @OmitFieldForRoles([Role.SECRETARY])
  // @ApiProperty({ example: '2615836294' })
  // phone: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @IsString()
  //si se crea secretary, specialist o institution, el nombre de usuario es opcional
  // @IsOptionalIf(
  //   (dto) =>
  //     dto.role == Role.SECRETARY ||
  //     dto.role == Role.SPECIALIST ||
  //     dto.role == Role.INSTITUTION
  // )
  @IsOptional()
  @ApiProperty({ example: 'juan123' })
  username: string;

  @IsString()
  // @IsStrongPassword(
  //   {
  //     minLength: 6,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1
  //   },
  //   {
  //     message:
  //       'Password must be at least 6 characters long and contain at least one upper case letter, one lower case letter, one number, and one special character(@$!%*?&)'
  //   }
  // )
  //si se crea secretary, specialist o institution, la contraseña es opcional
  @IsOptionalIf(
    (dto) =>
      dto.role == Role.INSTITUTION ||
      dto.role == Role.SECRETARY ||
      dto.role == Role.SPECIALIST
  )
  @ApiProperty({ example: 'Clave1*' })
  password: string;

  @IsEnum(Role)
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST]
  })
  role: Role;

  //recibe un id de profile image ya creado
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  profileImage?: ShortBaseDto;
}

//"reescribe" profile image, no permite actualizar rol
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'role',
    'profileImage',
    'username',
    'password'
  ] as const)
) {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ example: '2615836294' })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'juan123' })
  username?: string;

  @IsString()
  // @IsStrongPassword(
  //   {
  //     minLength: 6,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1
  //   },
  //   {
  //     message:
  //       'Password must be at least 6 characters long and contain at least one upper case letter, one lower case letter, one number, and one special character(@$!%*?&)'
  //   }
  // )
  @IsOptional()
  @ApiProperty({ example: 'Clave1*' })
  password?: string;

  //recibe un id de profile image
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  profileImage?: ShortBaseDto;
}

export class CreateUserDtoWithFiles {
  @ValidateNested()
  @Type(() => CreateUserDto)
  @ApiProperty({ type: CreateUserDto })
  turn?: CreateUserDto;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Imagen de perfil en formato PNG, JPG o JPEG'
  })
  profileImage?: Express.Multer.File[];
}
