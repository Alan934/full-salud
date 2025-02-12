import { Role } from '../../enums/role.enum';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Express } from 'express';
import 'multer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { OmitFieldForRoles } from '../../../common/util/custom-dto-properties-decorators/validate-omit-field-for-roles.util';
import { IsOptionalIf } from '../../../common/util/custom-dto-properties-decorators/validate-is-optional-if-decorator.util';
import { ShortBaseDto } from '../../../common/dtos';
import { Gender } from '../../../domain/enums';
import { DocumentType } from '../../../domain/enums';
import { Column } from 'typeorm';

export class UserDto {

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: 'juan123' })
  username: string;

  @IsOptional()
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
  //si se crea secretary, patient o institution, la contraseña es opcional
  @IsOptionalIf(
    (dto) =>
      dto.role == Role.INSTITUTION ||
      dto.role == Role.SECRETARY ||
      dto.role == Role.PATIENT
  )
  @ApiProperty({ example: 'Clave1*' })
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST]
  })
  role: Role;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'David' })
  name?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Peréz' })
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY],
  })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2000-08-21' })
  birth?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType?: DocumentType;

  @IsOptional()
  @IsString()
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2615836294' })
  phone?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @ApiProperty({ type: [ShortBaseDto] })
  addresses?: ShortBaseDto[];

}

export class AuthUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'juan123', required: false })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Clave1*' })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({ example: 'hashed_refresh_token' })
  refreshToken?: string;
}

//"reescribe" profile image, no permite actualizar rol
export class UpdateUserDto extends PartialType(
  OmitType(UserDto, [
    'role',
    'username',
    'password'
  ] as const)
) {
  // @IsNumberString()
  // 
  // @ApiProperty({ example: '2615836294' })
  // phone?: string;

  @IsString()

  @IsOptional()
  @ApiProperty({ example: 'juan123' })
  username?: string;

  @IsOptional()
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
  @ApiProperty({ example: 'Clave1*' })
  password?: string;

}

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'juan123', required: false })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Clave1*' })
  password: string;

}


// export class NameEntry {
//   @Expose()
//   @IsOptional()
//   @ApiProperty({ example: 'official' })
//   @IsString()
//   use?: string;

//   @Expose()
//   @IsOptional()
//   @ApiProperty({ example: 'Peréz' })
//   @IsString()
//   family?: string;

//   @Expose()
//   @IsOptional()
//   @ApiProperty({ example: ['David', 'Carlos'] })
//   @IsArray()
//   @IsString({ each: true })
//   given?: string[];
// }