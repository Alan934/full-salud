import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  UserDto,
  UpdateUserDto,
  UserPaginationDto,
  AuthUserDto
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
import { ProfileImagesService } from '../profile_images/profile_images.service';
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
    protected readonly profileImagesService: ProfileImagesService,
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
      let user: User | undefined;
  
      user = await this.patientRepository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      });
  
      if (!user) {
        user = await this.practitionerRepository.findOne({
          where: [{ email: email ?? undefined }, { username: username ?? undefined }],
        });
      }
  
      if (!user) {
        user = await this.repository.findOne({
          where: [{ email: email ?? undefined }, { username: username ?? undefined }],
        });
      }
  
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
        expiresIn: '7d',
      });
  
      user.refreshToken = await bcrypt.hash(refreshToken, 10);
      await this.repository.save(user);
  
      // Convertimos el usuario a DTO y agregamos los tokens en el mismo objeto
      const userDto = plainToInstance(UserDto, user);
      return { ...userDto, accessToken, refreshToken };
  
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
  
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: envConfig.JWT_REFRESH_SECRET,
      });
  
      const user = await this.repository.findOne({ where: { id: payload.sub } });
  
      if (!user || !user.refreshToken) {
        throw new ErrorManager('Invalid refresh token', 401);
      }
  
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        throw new ErrorManager('Invalid refresh token', 401);
      }
  
      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { secret: envConfig.JWT_SECRET, expiresIn: '15m' }
      );
  
      const newRefreshToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { secret: envConfig.JWT_REFRESH_SECRET, expiresIn: '7d' }
      );
  
      user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.repository.save(user);
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw ErrorManager.createSignatureError('Refresh token expired or invalid');
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
  
  //método que devuelve el servicio de notification preferences correspondiente al rol recibido por parametro
  // private getNotificationPreferenceServiceByRole(role: Role): any {
  //   switch (role) {
  //     // case Role.ADMIN:
  //     //   return this.adminsNotificationPreferencesService;
  //     // case Role.PATIENT:
  //     //   return this.patientsNotificationPreferencesService;
  //     case Role.SPECIALIST:
  //       return this.specialistsNotificationPreferencesService;
  //     // case Role.INSTITUTION:
  //     //   return this.institutionsNotificationPreferencesService;
  //     // case Role.SECRETARY:
  //     //   return this.secretaryNotificationPreferencesService;
  //     case Role.SPECIALISTS_SECRETARY:
  //       return this.specialistsSecretaryNotificationPreferencesService;
  //     default:
  //       throw ErrorManager.createSignatureError(
  //         "User's role is not a valid role"
  //       );
  //   }
  // }

  //Override del método create genérico
  // override async create(createDto: UserDto): Promise<User> {
  //   try {
  //     return await this.repository.manager.transaction(
  //       async (transactionalEntityManager) => {
  //         const newUser: User = await transactionalEntityManager.save(
  //           User,
  //           createDto
  //         ); //guarda el usuario obtenido
  //         //obtiene el servicio de preferencias de notificaciones que corresponde al rol del usuario
  //         const notificationPreferencesService =
  //           this.getNotificationPreferenceServiceByRole(newUser.role);

  //         //crea en la base de datos dos preferencias de notificaciones para el usuario, una para contener las preferencias de email y otra para las de whatsapp
  //         await notificationPreferencesService.create(
  //           new CreateNotificationPreferencesDto(Media.EMAIL, {
  //             id: newUser.id
  //           }),
  //           transactionalEntityManager
  //         );
  //         await notificationPreferencesService.create(
  //           new CreateNotificationPreferencesDto(Media.WHATSAPP, {
  //             id: newUser.id
  //           }),
  //           transactionalEntityManager
  //         );
  //         return newUser; //devuelve el usuario creado
  //       }
  //     );
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError((error as Error).message);
  //   }
  // }
 
  override async create(createDto: UserDto): Promise<User> {
    try {
      const existingUser = await this.repository.findOne({ where: { email: createDto.email } });

      if (existingUser) {
        throw ErrorManager.createSignatureError('Email is already in use');
      }

      const hashedPassword = await bcrypt.hash(createDto.password, 10);
      createDto.password = hashedPassword;

      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const newUser: User = await transactionalEntityManager.save(
            User,
            createDto
          );
          // Obtiene el servicio de preferencias de notificaciones que corresponde al rol del usuario
          // const notificationPreferencesService =
          //   this.getNotificationPreferenceServiceByRole(newUser.role);

          // // Crea en la base de datos dos preferencias de notificaciones para el usuario
          // await notificationPreferencesService.create(
          //   new CreateNotificationPreferencesDto(Media.EMAIL, {
          //     id: newUser.id
          //   }),
          //   transactionalEntityManager
          // );
          // await notificationPreferencesService.create(
          //   new CreateNotificationPreferencesDto(Media.WHATSAPP, {
          //     id: newUser.id
          //   }),
          //   transactionalEntityManager
          // );
          return newUser;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
//   async createUserWithPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction(); 
//     try {
//       const { email, password } = createPatientDto;
  
//       createPatientDto.role = Role.PATIENT;
  
//       const existingUser = await queryRunner.manager.findOne(User, { where: { email } });
//       if (existingUser) {
//         throw ErrorManager.createSignatureError('Email is already in use');
//       }
  
//       if (createPatientDto.dni) {
//         const existingDni = await queryRunner.manager.findOne(Patient, { where: { dni: createPatientDto.dni } });
//         if (existingDni) {
//           throw ErrorManager.createSignatureError('DNI is already in use');
//         }
//       }
  
//       if (createPatientDto.phone) {
//         const existingPhone = await queryRunner.manager.findOne(Patient, { where: { phone: createPatientDto.phone } });
//         if (existingPhone) {
//           throw ErrorManager.createSignatureError('Phone number is already in use');
//         }
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       createPatientDto.password = hashedPassword;
  
//       const newUser: User = queryRunner.manager.create(User, createPatientDto);
//       //const savedUser = await queryRunner.manager.save(User, newUser);
  
//       // const notificationPreferencesService = this.getNotificationPreferenceServiceByRole(savedUser.role);
//       // await notificationPreferencesService.create(
//       //   new CreateNotificationPreferencesDto(Media.EMAIL, { id: savedUser.id }),
//       //   queryRunner.manager
//       // );
//       // await notificationPreferencesService.create(
//       //   new CreateNotificationPreferencesDto(Media.WHATSAPP, { id: savedUser.id }),
//       //   queryRunner.manager
//       // );
  
//       // createPatientDto.id = savedUser.id;
//       const newPatient = queryRunner.manager.create(Patient, createPatientDto);
//       const savedPatient = await queryRunner.manager.save(Patient, newPatient);
  
//       await queryRunner.commitTransaction();
//       return savedPatient;
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw ErrorManager.createSignatureError((error as Error).message);
//     } finally {
//       await queryRunner.release();
//     }
//   }  

  async login(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.repository.findOne({ where: { email } });

      if (!user) {
        throw ErrorManager.createSignatureError('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw ErrorManager.createSignatureError('Invalid email or password');
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //condiciones que se agregarán al query builder para filtrar users
  private userConditions: Conditions<User> = {
    phone: (queryBuilder: SelectQueryBuilder<User>, value: string) =>
      queryBuilder.andWhere('user.phone = :phone', { phone: `${value}` }),
    email: (queryBuilder: SelectQueryBuilder<User>, value: string) =>
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${value}%` }),
    username: (queryBuilder: SelectQueryBuilder<User>, value: string) =>
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${value}%`
      }),
    role: (queryBuilder: SelectQueryBuilder<User>, value: Role) =>
      queryBuilder.andWhere('user.role = :role', { role: value })
  };

  //Override del método findAll genérico
  override async findAll(
    paginationDto: UserPaginationDto
  ): Promise<{ data: User[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;

      const queryBuilderBase = this.repository.createQueryBuilder('user');

      //añade las condiciones where al query builder
      const query = DynamicQueryBuilder.buildSelectQuery<User>(
        queryBuilderBase,
        this.userConditions,
        paginationDto
      );

      //añade la paginación al query creada
      query.skip((page - 1) * limit).take(limit);

      //ejecuta la query
      const entities = await query.getMany();

      return {
        data: entities,
        meta: getPagingData(entities, page, limit)
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Override del método softRemove genérico
  override async softRemove(id: string): Promise<string> {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const entity = await transactionalEntityManager.findOne(User, {
            where: { id }
          }); //obtiene la entidad user de la base de datos

          // //obtiene el servicio de preferencias de notificación según el rol del usuario
          // const notificationPreferencesService =
          //   this.getNotificationPreferenceServiceByRole(entity.role);
          // //obtiene las preferencias de notificaciones que corresponden al usuario
          // const notificationPreferences =
          //   (await notificationPreferencesService.getByUserIdWithManager(
          //     id,
          //     transactionalEntityManager
          //   )) as any[];

          // //realiza eliminación lógica de las preferencias de notificación del usuario
          // notificationPreferences.forEach(
          //   async (preference) =>
          //     await notificationPreferencesService.softRemove(
          //       preference.id,
          //       transactionalEntityManager
          //     )
          // );

          // realiza eliminacion lógica de las notificaciones del usuario
          // await this.notificationsService.softRemoveForUserWithManager(
          //   entity.id,
          //   transactionalEntityManager
          // );

          await transactionalEntityManager.softRemove(User, entity); //realiza eliminación lógica del usuario

          return `Entity with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Override del método restore genérico
  override async restore(id: string): Promise<User> {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const entity = await transactionalEntityManager.findOne(User, {
            where: { id },
            withDeleted: true
          } as FindManyOptions<User>); //obtiene la entidad de la base de datos

          //obtiene el servicio de notification preferences que corresponde al rol del usuario
          // const notificationPreferencesService =
          //   this.getNotificationPreferenceServiceByRole(entity.role);
          // //obtiene las preferencias de notificación eliminadas que están asociadas al usuario
          // const notificationPreferences =
          //   (await notificationPreferencesService.getByUserIdIncludeDeletedWithManager(
          //     id,
          //     transactionalEntityManager
          //   )) as any[];

          // //recupera las preferencias de notificación del usuario
          // notificationPreferences.forEach(
          //   async (preference) =>
          //     await notificationPreferencesService.restore(
          //       preference.id,
          //       transactionalEntityManager
          //     )
          // );

          // recupera las notificaciones del usuario
          // await this.notificationsService.restoreForUserWithManager(
          //   entity.id,
          //   transactionalEntityManager
          // );

          const recovered = await transactionalEntityManager.recover(
            User,
            entity
          ); //recupera la entidad de user

          return recovered;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Método que sube imágenes y se las asigna al nuevo usuario
  async createWithProfileImage(
    UserDto: UserDto,
    file?: Express.Multer.File | null // Es opcional enviar imágenes
  ): Promise<User> {
    // Inicia transacción
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let profileImage;
    try {
      // Verifica que file no sea nulo
      if (file) {
        // Crea y sube la imagen
        profileImage = await this.profileImagesService.uploadFile(file);
      }

      // Utiliza el create del servicio y le pasa el dto de user y la imagen
      const newUser = await this.create({
        ...UserDto
      });

      await queryRunner.commitTransaction();

      // Retorna el usuario creado
      return await this.findOne(newUser.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Eliminar la imágen subida si la transacción falla
      if (profileImage) {
        this.profileImagesService.deleteImage(profileImage.id);
      }
      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      await queryRunner.release();
    }
  }

  // Override del método remove genérico
  override async remove(id: string): Promise<string> {
    try {
      const user = await this.findOne(id); // Verifica que la entidad existe

      // Inicia la transacción
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.remove(user); // Elimina el usuario, si existe

          return `User with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //eliminar un usuario con un manager de entidades
  async removeWithManager(id: string, manager: EntityManager) {
    try {
      const user = await manager.findOne(User, {
        where: { id }
      });

      await manager.remove(user);

    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemoveWithManager(
    id: string,
    manager: EntityManager
  ): Promise<string> {
    try {
      const entity = await manager.findOne(User, {
        where: { id }
      }); //obtiene la entidad user de la base de datos

      //obtiene el servicio de preferencias de notificación según el rol del usuario
      // const notificationPreferencesService =
      //   this.getNotificationPreferenceServiceByRole(entity.role);
      // //obtiene las preferencias de notificaciones que corresponden al usuario
      // const notificationPreferences =
      //   (await notificationPreferencesService.getByUserIdWithManager(
      //     id,
      //     manager
      //   )) as any[];

      // //realiza eliminación lógica de las preferencias de notificación del usuario
      // notificationPreferences.forEach(
      //   async (preference) =>
      //     await notificationPreferencesService.softRemove(
      //       preference.id,
      //       manager
      //     )
      // );

      // realiza eliminacion lógica de las notificaciones del usuario
      // await this.notificationsService.softRemoveForUserWithManager(
      //   entity.id,
      //   manager
      // );

      await manager.softRemove(User, entity); //realiza eliminación lógica del usuario

      return `Entity with id ${id} soft deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(id: string, manager: EntityManager): Promise<User> {
    try {
      const entity = await manager.findOne(User, {
        where: { id },
        withDeleted: true
      } as FindManyOptions<User>); //obtiene la entidad de la base de datos

      //obtiene el servicio de notification preferences que corresponde al rol del usuario
      // const notificationPreferencesService =
      //   this.getNotificationPreferenceServiceByRole(entity.role);
      // //obtiene las preferencias de notificación eliminadas que están asociadas al usuario
      // const notificationPreferences =
      //   (await notificationPreferencesService.getByUserIdIncludeDeletedWithManager(
      //     id,
      //     manager
      //   )) as any[];

      //recupera las preferencias de notificación del usuario
      // await Promise.all(
      //   notificationPreferences.map(
      //     async (preference) =>
      //       await notificationPreferencesService.restore(preference.id, manager)
      //   )
      // );

      // recupera las notificaciones del usuario
      // await this.notificationsService.restoreForUserWithManager(
      //   entity.id,
      //   manager
      // );

      const recovered = await manager.recover(User, entity); //recupera la entidad de user

      return recovered;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
