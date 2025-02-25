import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  UserDto,
  UpdateUserDto,
  UserPaginationDto,
  AuthUserDto,
  SerializerUserDto
} from '../../domain/dtos';
import { Express } from 'express';
import 'multer';
import { Patient, Practitioner, User } from '../../domain/entities';
import { Role } from '../../domain/enums/role.enum';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
// import { PatientsNotificationPreferencesService } from '../patients_notification_preferences/patients-notification-preferences.service';
// import { SpecialistsNotificationPreferencesService } from '../specialists_notification_preferences/specialists-notification-preferences.service';
// import { InstitutionsNotificationPreferencesService } from '../institutions_notification_preferences/institutions-notification-preferences.service';
// import { AdminsNotificationPreferencesService } from '../admins_notification_preferences/admins-notification-preferences.service';
// import { SecretaryNotificationPreferencesService } from '../secretary_notification_preferences/secretary-notification-preferences.service';
// import { SpecialistsSecretaryNotificationPreferencesService } from '../specialists_secretary_notification_preferences/specialists-secretary-notification-preferences.service';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import {
  Conditions,
  DynamicQueryBuilder
} from '../../common/util/dynamic-query-builder.util';
// import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from '../../config/envs';

@Injectable()
export class AuthService extends BaseService<
  User,
  UserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User) protected repository: Repository<User>,
    // protected readonly patientsNotificationPreferencesService: PatientsNotificationPreferencesService,
    // protected readonly specialistsNotificationPreferencesService: SpecialistsNotificationPreferencesService,
    // protected readonly institutionsNotificationPreferencesService: InstitutionsNotificationPreferencesService,
    // protected readonly adminsNotificationPreferencesService: AdminsNotificationPreferencesService,
    // protected readonly secretaryNotificationPreferencesService: SecretaryNotificationPreferencesService,
    // protected readonly specialistsSecretaryNotificationPreferencesService: SpecialistsSecretaryNotificationPreferencesService,
    // protected readonly notificationsService: NotificationsService,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Practitioner) private readonly practitionerRepository: Repository<Practitioner>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource
  ) {
    super(repository);
  }

  async onModuleInit() {
    await this.ensureAdminExists();
  }

  async loginUser(loginDto: AuthUserDto): Promise<UserDto & { accessToken: string; refreshToken: string }> {
    const { email, username, password } = loginDto;
    try {
      let user: User | undefined = await this.patientRepository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      }) || await this.practitionerRepository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      }) || await this.repository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      });

      if (!user) {
        throw new ErrorManager('Invalid email, username, or password', 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new ErrorManager('Invalid email, username, or password', 401);
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: envConfig.JWT_SECRET,
        expiresIn: '15m',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: envConfig.JWT_REFRESH_SECRET,
        expiresIn: '1d',
      });

      const userDto = plainToInstance(SerializerUserDto, user);
      return { ...userDto, accessToken, refreshToken };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
  async generateRefreshToken(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
  
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: envConfig.JWT_SECRET,
      expiresIn: '15m',
    });
  
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: envConfig.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });
  
    return { accessToken, refreshToken };
  }
  
  async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: envConfig.JWT_REFRESH_SECRET,
      });
  
      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { secret: envConfig.JWT_SECRET, expiresIn: '15m' }
      );
  
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new ErrorManager('Invalid or expired refresh token', 401);
    }
  } 

  async createAdmin(createUserDto: AuthUserDto): Promise<UserDto> {
    try {
      const existingUser = await this.repository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username }
        ],
      });
  
      if (existingUser) {
        throw new ErrorManager('Email or username already in use', 400);
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      const newAdmin = this.repository.create({
        ...createUserDto,
        password: hashedPassword,
        role: Role.ADMIN,
      });
  
      const savedAdmin = await this.repository.save(newAdmin);
  
      return plainToInstance(UserDto, savedAdmin, { excludeExtraneousValues: true });
  
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async ensureAdminExists() {
    const adminExists = await this.repository.findOne({
      where: { role: Role.ADMIN },
    });

    if (!adminExists) {
      console.log('No admin found. Creating default admin...');

      const defaultAdmin = this.repository.create({
        email: 'admin@example.com',
        username: 'admin',
        password: await bcrypt.hash('Admin123*', 10),
        role: Role.ADMIN,
        name: 'Default',
        lastName: 'Admin',
      });

      await this.repository.save(defaultAdmin);
      console.log('Default admin created successfully.');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      let user: User | undefined = await this.patientRepository.findOne({
        where: [{ id: userId ?? undefined }],
      }) || await this.practitionerRepository.findOne({
        where: [{ id: userId ?? undefined }],
      }) || await this.repository.findOne({
        where: [{ id: userId ?? undefined }],
      });
  
      if (!user) {
        throw new ErrorManager('Invalid User by id', 401);
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }    
  }
    
}
