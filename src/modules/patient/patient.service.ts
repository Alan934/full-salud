import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePatientDto,
  SerializerPatientDto,
  UpdatePatientDto
} from '../../domain/dtos';
import {
  Patient,
  Practitioner,
  SocialWorkEnrollment,
  User
} from '../../domain/entities';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { Not, Repository } from 'typeorm';
import { Role, DocumentType } from '../../domain/enums';
import { AuthService } from '../auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) protected patientRepository: Repository<Patient>,
    @InjectRepository(Practitioner)
    private readonly practitionerRepository: Repository<Practitioner>,
    @InjectRepository(SocialWorkEnrollment)
    private readonly socialWorkEnrollmentRepository: Repository<SocialWorkEnrollment>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    protected repository: Repository<User>
  ) {}

  async createPatient(createPatientDto: CreatePatientDto) {
    try {
      const {
        dni,
        email,
        phone,
        username,
        password,
        socialWorkEnrollmentId,
        ...userData
      } = createPatientDto;

      const user = await this.repository.findOne({ where: { email } });

      const existingPatient = await this.patientRepository.findOne({
        where: [{ dni }, { email }, { phone }, { username }]
      });

      const existingSpecialist = await this.practitionerRepository.findOne({
        where: [{ email }, { username }]
      });

      if (existingPatient || existingSpecialist || user) {
        throw new ErrorManager(
          'User with provided DNI, email, username, or phone already exists',
          400
        );
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      let socialWorkEnrollment: SocialWorkEnrollment | null = null;
      if (socialWorkEnrollmentId) {
        socialWorkEnrollment =
          await this.socialWorkEnrollmentRepository.findOne({
            where: { id: socialWorkEnrollmentId }
          });
        if (!socialWorkEnrollment) {
          throw new ErrorManager(
            `Social Work with ID ${socialWorkEnrollmentId} not found`,
            400
          );
        }
      }

      const patient = this.patientRepository.create({
        ...userData,
        password: hashedPassword,
        dni,
        email,
        phone,
        username,
        socialWorkEnrollment,
        role: Role.PATIENT
      });

      const savedPatient = await this.patientRepository.save(patient);

      const payload: JwtPayload = {
        id: savedPatient.id,
        email: savedPatient.email,
        role: savedPatient.role,
        name: savedPatient.name,
        lastName: savedPatient.lastName
      };
      const token = await this.authService.signJWT(payload);

      const patientDto = plainToInstance(SerializerPatientDto, savedPatient);

      return { ...patientDto, accesttoken: token };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    patients: Patient[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.patientRepository.findAndCount({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit
      });

      return {
        patients: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<Patient> {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['socialWorkEnrollment', 'socialWorkEnrollment.socialWork']
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      return patient;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto
  ): Promise<Patient> {
    try {
      const patient = await this.getOne(id);

      const hasUniqueData = updatePatientDto.email || updatePatientDto.dni;

      if (hasUniqueData) {
        // 2.1. Comprobar si los nuevos datos únicos ya existen en OTRO paciente
        const orConditions = [];
        if (updatePatientDto.email)
          orConditions.push({ email: updatePatientDto.email });
        if (updatePatientDto.dni)
          orConditions.push({ dni: updatePatientDto.dni });

        if (orConditions.length > 0) {
          const conflictingPatient = await this.patientRepository.findOne({
            where: orConditions.map((condition) => ({
              ...condition,
              id: Not(id) // Busca en pacientes con ID DIFERENTE al actual
            }))
          });

          if (conflictingPatient) {
            // Construir mensaje de error específico
            let conflictingField = '';
            if (
              updatePatientDto.email &&
              conflictingPatient.email === updatePatientDto.email
            )
              conflictingField = 'email';
            else if (
              updatePatientDto.dni &&
              conflictingPatient.dni === updatePatientDto.dni
            )
              conflictingField = 'DNI';

            throw new ErrorManager(
              `Another patient already exists with the provided ${conflictingField}.`,
              409
            );
          }
        }

        // Comprobar si los nuevos datos únicos (email, username) ya existen en algún Practitioner
        const practitionerOrConditions = [];
        if (updatePatientDto.email)
          practitionerOrConditions.push({ email: updatePatientDto.email });
        if (updatePatientDto.dni)
          practitionerOrConditions.push({ dni: updatePatientDto.dni });

        if (practitionerOrConditions.length > 0) {
          const conflictingPractitioner =
            await this.practitionerRepository.findOne({
              where: practitionerOrConditions
            });

          if (conflictingPractitioner) {
            let conflictingField = '';
            if (
              updatePatientDto.email &&
              conflictingPractitioner.email === updatePatientDto.email
            )
              conflictingField = 'email';
            else if (
              updatePatientDto.dni &&
              conflictingPractitioner.dni === updatePatientDto.dni
            )
              conflictingField = 'dni';

            throw new ErrorManager(
              `A practitioner already exists with the provided ${conflictingField}.`,
              409
            );
          }
        }
      }

      const { socialWorkEnrollmentId, ...updateData } = updatePatientDto;

      if (socialWorkEnrollmentId) {
        const socialWorkEnrollment =
          await this.socialWorkEnrollmentRepository.findOne({
            where: { id: socialWorkEnrollmentId }
          });
        if (!socialWorkEnrollment) {
          throw new ErrorManager(
            `Social Work Enrollment with ID ${socialWorkEnrollmentId} not found`,
            404
          ); // Not Found
        }
        patient.socialWorkEnrollment = socialWorkEnrollment;
      } else if (
        updatePatientDto.hasOwnProperty('socialWorkEnrollmentId') &&
        socialWorkEnrollmentId === null
      ) {
        // Permitir desasignar la obra social si se envía null explícitamente
        patient.socialWorkEnrollment = null;
      }

      Object.assign(patient, updateData);

      return await this.patientRepository.save(patient);
    } catch (error) {
      if (error instanceof ErrorManager) {
        throw error;
      }
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const patient = await this.getOne(id);

      await this.patientRepository.softRemove(patient);

      return { message: 'Patient soft deleted successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recover(id: string): Promise<{ message: string }> {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        withDeleted: true
      });

      if (!patient || !patient.deletedAt) {
        throw new NotFoundException(
          `Patient with ID ${id} not found or not deleted`
        );
      }

      await this.patientRepository.recover(patient);

      return { message: 'Patient recovered successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getByDocument(
    type: DocumentType,
    number: string
  ): Promise<SerializerPatientDto> {
    try {
      // Validaciones según el tipo de documento
      switch (type) {
        case DocumentType.DNI:
          if (!/^\d{7,8}$/.test(number)) {
            throw new ErrorManager(
              'Invalid DNI format. Must be 7 or 8 digits',
              400
            );
          }
          break;
        case DocumentType.PASSPORT:
          if (!/^[A-Za-z0-9]{6,12}$/.test(number)) {
            throw new ErrorManager('Invalid Passport format', 400);
          }
          break;
        default:
          throw new ErrorManager('Invalid document type', 400);
      }

      const patient = await this.patientRepository.findOne({
        where: {
          documentType: type,
          dni: number
        },
        relations: ['socialWorkEnrollment', 'socialWorkEnrollment.socialWork']
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ${type} ${number} not found`);
      }

      return plainToInstance(SerializerPatientDto, patient);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
