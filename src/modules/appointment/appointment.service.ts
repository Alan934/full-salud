import {
  BadRequestException,
  Logger,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  CreateAppointmentDto,
  SerializerAppointmentDto,
  TimeDTO,
  UpdateAppointmentDto
} from '../../domain/dtos';
import {
  PatientAppointment,
  Patient,
  Practitioner,
  Appointment,
  PractitionerAppointment
} from '../../domain/entities';
import { AppointmentStatus, Day, Role } from '../../domain/enums';
import 'multer';
import { Between, In, Not, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from '../auth/auth.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name)
  constructor(
    @InjectRepository(Appointment) protected repository: Repository<Appointment>,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('whatsapp') private readonly whatsappQueue: Queue,
  ) { }

  async createTurn(
    createTurnDto: CreateAppointmentDto
  ): Promise<Appointment> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let patient: Patient;
      // Verificar si llega `patientId` o el objeto `patient`
      if (createTurnDto.patientId) {
        patient = await queryRunner.manager.findOne(Patient, {
          where: { id: createTurnDto.patientId }
        });

        if (!patient) {
          throw new NotFoundException(
            `Patient with ID ${createTurnDto.patientId} not found`
          );
        }
      } else if (createTurnDto.patient) {

        const existingPatient = await queryRunner.manager.findOne(Patient, {
          where: [{ dni: createTurnDto.patient.dni },
            { email: createTurnDto.patient.email },
            { phone: createTurnDto.patient.phone }
          ]
        });

        if (existingPatient) {
          patient = existingPatient;
        } else {

          const patientData = {
            dni: createTurnDto.patient.dni,
            name: createTurnDto.patient.name,
            lastName: createTurnDto.patient.lastName,
            email: createTurnDto.patient.email,
            phone: createTurnDto.patient.phone,
            documentType: createTurnDto.patient.documentType,
            birth: createTurnDto.patient.birth,
            gender: createTurnDto.patient.gender,
            username: createTurnDto.patient.username,
            googleBool: createTurnDto.patient.googleBool,
            urlImg: createTurnDto.patient.urlImg,
            addresses: createTurnDto.patient.addresses,
            relationship: createTurnDto.patient.relationship,
            role: Role.PATIENT
          };

          patient = queryRunner.manager.create(Patient, patientData);
          patient = await queryRunner.manager.save(patient);
        }
      } else {
        throw new BadRequestException(
          'Either patientId or patient object must be provided'
        );
      }

      const specialistIds = createTurnDto.practitionerIds.map((s) => s.id);

      // Asegurarnos de que los IDs no estén vacíos
      if (!specialistIds || specialistIds.length === 0) {
        throw new BadRequestException(
          'At least one specialist ID must be provided'
        );
      }

      const specialists = await queryRunner.manager.find(Practitioner, {
        where: { id: In(specialistIds) }
      });

      // Comprobamos si el número de especialistas encontrados coincide con los solicitados
      if (specialists.length !== specialistIds.length) {
        const notFoundIds = specialistIds.filter(
          (id) => !specialists.some((s) => s.id === id)
        );
        throw new NotFoundException(
          `Practitioner with IDs ${notFoundIds.join(', ')} not found`
        );
      }

      // Validar que la fecha y el horario sea correcto
      const dateOfWeek = this.getDayOfWeek(createTurnDto.date);
           
      for(const specialist of specialists){
        const availability = await queryRunner.manager.findOne(PractitionerAppointment, {
          where: {
            practitioner: specialist,
            day: dateOfWeek
          }
        })
        if (!availability) {
          throw new BadRequestException(
            `Practitioner with ID ${specialistIds} is not available on ${dateOfWeek}`
          );
        }

        const appointmentHour = createTurnDto.hour;

        if (
          appointmentHour < availability.startHour ||
          appointmentHour >= availability.endHour
        ) {
          throw new BadRequestException(
            `Practitioner with ID ${specialistIds} is not available at ${createTurnDto.hour}`
          );
        }
      }

      const newTurn = queryRunner.manager.create(Appointment, {
        date: createTurnDto.date,
        hour: createTurnDto.hour,
        observation: createTurnDto.observation,
        status: createTurnDto.status ?? AppointmentStatus.PENDING,
        patient,
        practitioners: specialists
      });
      //----------  Validacion de superposicion de Turnos ------------------------
      const existingTurns = createTurnDto.date
      ? await this.repository
          .createQueryBuilder('appointment')
          .leftJoinAndSelect('appointment.practitioners', 'practitioner')
          .select([
            'appointment.hour AS appointment_hour',
            'MAX(practitioner.durationAppointment) AS consultation_time',
            'STRING_AGG(practitioner.id::text, \',\') AS practitioner_ids'
          ])
          .where('appointment.date = :date AND appointment.deletedAt IS NULL', { 
            date: createTurnDto.date 
          })
          .groupBy('appointment.hour')
          .getRawMany()
      : null;

      const savedTurn = await queryRunner.manager.save(newTurn);
      const consultationTime = await this.maxConsultationTime(savedTurn.id);

      if (createTurnDto.date && createTurnDto.hour) {
        // Asegurémonos de que hour es un string
        const hourStr = String(createTurnDto.hour);
        const consultationTimeStr = String(consultationTime);
        
        const validateTurn = await this.validateTurn(
          hourStr,
          existingTurns,
          consultationTimeStr,
          specialistIds
        );
        if (!validateTurn) {
          await queryRunner.manager.delete(Appointment, savedTurn.id);
          throw new BadRequestException('El turno se superpone con otro turno existente.');
        }
      }
      //-----------------------------------------------------------------------------------

      // After saving, populate the practitionerIds
      savedTurn.practitionerId = specialists.map((specialist) => specialist.id);

      if (
        createTurnDto.patientAppointment &&
        createTurnDto.patientAppointment.length > 0
      ) {
        const appointmentSlot = createTurnDto.patientAppointment.map(
          (hourData) => {
            return queryRunner.manager.create(PatientAppointment, {
              openingHour: hourData.openingHour,
              closeHour: hourData.closeHour,
              day: hourData.day,
              turn: savedTurn
            });
          }
        );

        await queryRunner.manager.save(PatientAppointment, appointmentSlot);
        savedTurn.patientAppointment = appointmentSlot;
        
       
        // create notification to doctor 
        for(const practitioner of savedTurn.practitioners){
          await this.notificationService.createNotification({
            userId: practitioner.id,
            read: false,
            title: "Nuevo Turno",
            text: `Se ha creado un nuevo turno para el ${savedTurn.date} a las ${savedTurn.hour}`
          },  queryRunner.manager)
        }
        
        }
      //}

      savedTurn.email3 = "";
      savedTurn.email24 = "";
      savedTurn.whats3 = "";
      savedTurn.whats24 = "";
      savedTurn.reprogrammed = false;

      await queryRunner.commitTransaction();

      // Schedule emails only after the transaction is committed
      if (patient.email) {
        const appointmentDate = new Date(`${createTurnDto.date}T${createTurnDto.hour}:00`);
        const now = new Date();
        const timeDifference = appointmentDate.getTime() - now.getTime(); // Difference in milliseconds


        // Duración de la consulta para calcular el tiempo de la cita
        const appointmentDurationMs = (savedTurn.practitioners[0]?.durationAppointment || 30) * 60 * 1000;

        if (timeDifference < 24 * 60 * 60 * 1000) {
          // If the appointment is less than 24 hours away, send a custom 3-hour reminder
          const threeHoursBefore = new Date(appointmentDate.getTime() - 3 * 60 * 60 * 1000);

          const new3 = await this.emailQueue.add(
            'sendEmail',
            {
              to: patient.email,
              subject: 'Recordatorio: Tu cita es pronto',
              text: `Estimado/a ${patient.name}, tu cita está programada para el ${createTurnDto.date} a las ${createTurnDto.hour} 
              con una duración aproximada de ${savedTurn.practitioners[0]?.durationAppointment || 30} minutos. Por favor, asegúrate de estar preparado/a.`,
            },
            { delay: threeHoursBefore.getTime() - Date.now() } // Delay in milliseconds
          );

          savedTurn.email3 = String(new3.id);
        } else {
          // Schedule 3-hour reminder
          const threeHoursBefore = new Date(appointmentDate.getTime() - 3 * 60 * 60 * 1000);
          const three = await this.emailQueue.add(
            'sendEmail',
            {
              to: patient.email,
              subject: 'Recordatorio: Tu cita es en 3 horas',
              text: `Estimado/a ${patient.name}, este es un recordatorio de que tu cita está programada para el ${createTurnDto.date} a las ${createTurnDto.hour} 
              con una duración aproximada de ${savedTurn.practitioners[0]?.durationAppointment || 30} minutos.`,
            },
            { delay: threeHoursBefore.getTime() - Date.now() } // Delay in milliseconds
          );

          savedTurn.email3 = String(three.id);

          // Schedule 24-hour reminder
          const twentyFourHoursBefore = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
          const twentyFour = await this.emailQueue.add(
            'sendEmail',
            {
              to: patient.email,
              subject: 'Recordatorio: Tu cita es en 24 horas',
              text: `Estimado/a ${patient.name}, este es un recordatorio de que tu cita está programada para el ${createTurnDto.date} a las ${createTurnDto.hour} 
              con una duración aproximada de ${savedTurn.practitioners[0]?.durationAppointment || 30} minutos.`,
            },
            { delay: twentyFourHoursBefore.getTime() - Date.now() } // Delay in milliseconds
          );

          savedTurn.email24 = String(twentyFour.id);
        }
      }

      // Schedule WhatsApp messages only after the transaction is committed
      if (patient.phone) {
        const appointmentDate = new Date(`${createTurnDto.date}T${createTurnDto.hour}:00`);
        const now = new Date();
        const timeDifference = appointmentDate.getTime() - now.getTime(); // Difference in milliseconds

        if (timeDifference < 24 * 60 * 60 * 1000) {
          // If the appointment is less than 24 hours away, send only a 3-hour reminder
          const threeHoursBefore = new Date(appointmentDate.getTime() - 3 * 60 * 60 * 1000);

          const new3whats = await this.whatsappQueue.add(
            'sendMessage',
            {
              to: patient.phone,
              message: `Hola ${patient.name} te recordamos que tu turno es en 3 horas con el doctor Juan`,
            },
            { delay: threeHoursBefore.getTime() - Date.now() } // Delay in milliseconds
          );

          savedTurn.whats3 = String(new3whats.id);
        } else {
          // Schedule 3-hour reminder
          const threeHoursBefore = new Date(appointmentDate.getTime() - 3 * 60 * 60 * 1000);
          const threeWhats = await this.whatsappQueue.add(
            'sendMessage',
            {
              to: patient.phone,
              message: patient.name,
            },
            { delay: threeHoursBefore.getTime() - Date.now() } // Delay in milliseconds
          );

          savedTurn.whats3 = String(threeWhats.id);

          // Schedule 24-hour reminder
          const twentyFourHoursBefore = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
          const twentyFourWhats = await this.whatsappQueue.add(
            'sendMessage',
            {
              to: patient.phone,
              message: patient.name,
            },
            { delay: twentyFourHoursBefore.getTime() - Date.now() } // Delay in milliseconds
          );

          savedTurn.whats24 = String(twentyFourWhats.id);
        }
      }  

      // Save the updated `savedTurn` with job IDs
      await this.repository.save(savedTurn);

      return savedTurn;
    } catch (error) {
      // Solo hacer rollback si la transacción está activa
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      // Re-lanzar el error para que Nest lo maneje
      throw error;
    } finally {
      // Liberar el queryRunner siempre
      await queryRunner.release();
    }
  }

  getDayOfWeek(dateStr: string): Day {
  const date = new Date(`${dateStr}T00:00:00`);
    
    const dayNumber = date.getDay();
    
    const dayMap: { [key: number]: Day } = {
      0: Day.SUNDAY,
      1: Day.MONDAY,
      2: Day.TUESDAY,
      3: Day.WEDNESDAY,
      4: Day.THURSDAY,
      5: Day.FRIDAY,
      6: Day.SATURDAY,
    };
    
    return dayMap[dayNumber];
  }

  async getOne(id: string): Promise<Appointment> {
    try {
      const turn = await this.repository.findOne({
        where: { id, deletedAt: null },
        relations: ['patient', 'practitioners']
      });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      return turn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: { deletedAt: null },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit
      });

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Turnos de un especialista por ID, por estado PENDING, APPROVED, NO_SHOW
  async getTurnsBySpecialist(
    specialistId: string
  ): Promise<Appointment[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      sixMonthsLater.setHours(23, 59, 59, 999); // Hasta 6 meses a partir de hoy

      // Formatear fechas como strings en formato YYYY-MM-DD para comparación
      const todayStr = today.toISOString().split('T')[0];
      const sixMonthsLaterStr = sixMonthsLater.toISOString().split('T')[0];

      const turns = await this.repository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect('appointment.practitioners', 'practitioners')
        .where('practitioners.id = :specialistId', { specialistId })
        .andWhere('appointment.status IN (:...statuses)', {
          statuses: [
            AppointmentStatus.PENDING,
            AppointmentStatus.APPROVED,
            AppointmentStatus.NO_SHOW
          ]
        })
        // .andWhere('appointment.status != :noShowStatus', { 
        //   noShowStatus: AppointmentStatus.NO_SHOW 
        // })
        .andWhere('appointment.deletedAt IS NULL')
        .andWhere('appointment.date BETWEEN :today AND :sixMonthsLater', {
          today: todayStr,
          sixMonthsLater: sixMonthsLaterStr
        })
        .orderBy('appointment.date', 'ASC')
        .addOrderBy('appointment.hour', 'ASC')
        .getMany();

      if (!turns.length) {
        throw new NotFoundException(
          `No turns found for specialist with ID ${specialistId} within the next 6 months`
        );
      }

      return turns;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
  async getTurnStatsForSpecialist(
    specialistId: string,
    period?: 'week' | 'month' | 'year'
  ): Promise <{
    completedStats: { count: number; percentage: number };
    canceledStats: { count: number; percentage: number };
    totalTurns: number;
    period?: { start: string; end: string };
  }> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('appointment')
        .leftJoin('appointment.practitioners', 'practitioner')
        .select('appointment.status', 'status')
        .addSelect('COUNT(appointment.id)', 'count')
        .where('practitioner.id = :specialistId', { specialistId })
        .andWhere('appointment.status IN (:...statuses)', {
          statuses: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]
        })
        .andWhere('appointment.deletedAt IS NULL');


        let startDate: string;
        let endDate: string;

        if(period) {
          const today = new Date();
          endDate = today.toISOString().split('T')[0]; // Fecha actual
      
          if(period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            startDate = weekAgo.toISOString().split('T')[0];
          }else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            startDate = monthAgo.toISOString().split('T')[0];
          } else if (period === 'year') {
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            startDate = yearAgo.toISOString().split('T')[0];
          }


          const stats = await queryBuilder
            .groupBy('appointment.status')
            .getRawMany();

          if (stats.length === 0) {
            throw ErrorManager.createSignatureError(
              `No completed or cancelled turns found for specialist with ID ${specialistId}${period ? ` in the last ${period}` : ''}`
            );
          }

          let completedCount = 0;
          let cancelledCount = 0;

          stats.forEach(stat => {
            if (stat.status === AppointmentStatus.COMPLETED) {
              completedCount = parseInt(stat.count);
            } else if (stat.status === AppointmentStatus.CANCELLED) {
              cancelledCount = parseInt(stat.count);
            }
          });

          const totalTurns = completedCount + cancelledCount;

          const completedPercentage = totalTurns > 0 ? (completedCount / totalTurns) * 100 : 0;
          const canceledPercentage = totalTurns > 0 ? (cancelledCount / totalTurns) * 100 : 0;

          const result = {
            completedStats: {
              count: completedCount,
              percentage: completedPercentage
            },
            canceledStats: {
              count: cancelledCount,
              percentage: canceledPercentage
            },
            totalTurns
          };


        if (period) {
          return {
            ...result,
            period: {
              start: startDate,
              end: endDate
            }
          };
        }

    return result;
    } 
  }catch (error) {
    throw ErrorManager.createSignatureError((error as Error).message);
  }
}

async getTurnsByDniAndPractitioner(
  dni: string,
  practitionerId: string
): Promise<Appointment[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toISOString().split('T')[0];

    const turns = await this.repository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.practitioners', 'practitioners')
      .where('patient.dni = :dni', { dni })
      .andWhere('practitioners.id = :practitionerId', { practitionerId })
      .andWhere('appointment.date >= :today', { today: todayStr })
      .andWhere('appointment.deletedAt IS NULL')
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.hour', 'ASC')
      .getMany();

    if (!turns.length) {
      throw new NotFoundException(
        `No turns found for patient with DNI ${dni} and practitioner ID ${practitionerId} from today onwards`
      );
    }

    return turns;
  } catch (error) {
    throw ErrorManager.createSignatureError((error as Error).message);
  }
}

async getTurnsBySpecialistAll(
  specialistId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  turns: Appointment[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}> {
  try {
    const [data, total] = await this.repository.findAndCount({
      where: {
        practitioners: { id: specialistId },
        status: Not(AppointmentStatus.NO_SHOW),
        deletedAt: null
      },
      relations: ['patient', 'practitioners'],
      skip: (page - 1) * limit,
      take: limit
    });

    if (!data.length) {
      throw new NotFoundException(
        `No turns found for specialist with ID ${specialistId}`
      );
    }

    return {
      turns: data,
      total,
      page,
      limit,
      previousPage: page > 1 ? page - 1 : null
    };
  } catch (error) {
    throw ErrorManager.createSignatureError((error as Error).message);
  }
}

  // Turnos de un paciente por ID
  async getTurnsByPatient(
    patientId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: In([
            AppointmentStatus.PENDING,
            AppointmentStatus.APPROVED,
            AppointmentStatus.NO_SHOW
          ]),
          deletedAt: null
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit
      });

      if (!data.length) {
        throw new NotFoundException(
          `No turns found for patient with ID ${patientId}`
        );
      }

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
        
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getTurnsByPatientAll(
    patientId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: Not(AppointmentStatus.NO_SHOW),
          deletedAt: null
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit
      });

      if (!data.length) {
        throw new NotFoundException(
          `No turns found for patient with ID ${patientId}`
        );
      }

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Obtener turnos completados por el ID del paciente (historial).
  async getCompletedTurnsByPatient(
    patientId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: AppointmentStatus.COMPLETED,
          deletedAt: null
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit
      });

      if (!data.length) {
        throw new NotFoundException(
          `No completed turns found for patient ID ${patientId}`
        );
      }

      return {
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
        turns: data
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Soft delete para eliminar un turno.
  async removeTurn(
    id: string,
    reprog: boolean
  ): Promise<{ message: string }> {
    try {
      const turn = await this.repository.findOne({
        where: { id, deletedAt: null }
      });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      // this.cancelQueue(turn.id);

      const deletedTurn = await this.repository.softRemove(turn);

      if(reprog === true) {
        deletedTurn.reprogrammed = true;
        await this.repository.save(deletedTurn);
      }

      const {id:NewId, date, hour, ...rest} = deletedTurn;

      return {
        message: `Turn with ID: ${NewId} for ${date} at ${hour} deleted successfully`,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Recover para restaurar un turno eliminado.
  async recoverTurn(id: string): Promise<Appointment> {
    try {
      const turn = await this.repository.findOne({
        withDeleted: true,
        where: { id }
      });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      await this.repository.recover(turn);
      return turn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async updateTurn(
    id: string,
    updateTurnDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    // Verifica primero si el turno existe
    const turn = await this.repository.findOne({
      where: { id, deletedAt: null },
      relations: ['patient', 'practitioners'], // Asegúrate de cargar relaciones necesarias
    });
  
    if (!turn) {
      throw new NotFoundException(`Turn with ID ${id} not found`);
    }
  
    // Actualiza solo los campos permitidos (evita sobreescribir relaciones directamente)
    const allowedFields = {
      // date: updateTurnDto.date,
      // hour: updateTurnDto.hour,
      // observation: updateTurnDto.observation,
      status: updateTurnDto.status,
    };
  
    Object.assign(turn, allowedFields);
  
   
  
    try {
      // Guarda los cambios
      const updatedTurn = await this.repository.save(turn);
  
      // Notificaciones (si es necesario)
      this.logger.log('getting user that cancel by id: ', updateTurnDto.userId)
      const loggedUser = await this.authService.getUserById(updateTurnDto.userId);
      this.logger.log(loggedUser.role)
      if (updateTurnDto.status === AppointmentStatus.CANCELLED) {
        if (loggedUser.role === Role.PRACTITIONER) {
          await this.notificationService.createNotification({
            patientId: turn.patient.id,
            read: false,
            title: "Cancelación de Turno",
            text: `Se ha cancelado el turno para el ${turn.date} a las ${turn.hour}`,
          });
        } else {
          for (const practitioner of turn.practitioners) {
            this.logger.log('practitioner id: ', practitioner.id), 
            await this.notificationService.createNotification({
              practitionerId: practitioner.id,
              read: false,
              title: "Cancelación de Turno",
              text: `Se ha cancelado el turno para el ${turn.date} a las ${turn.hour}`,
            });
          }
        }
      }
  
      return updatedTurn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Verificar superposición de turnos
  async checkOverlapAndUpdateTurn(
    id: string,
    updateTurnDto: UpdateAppointmentDto
  ): Promise<SerializerAppointmentDto> {
    try {
      const { date, hour } = updateTurnDto;

      // Validar que la fecha y hora estén presentes
      if (!date || !hour) {
        throw new BadRequestException('Date and hour are required');
      }

      // Validar el formato de la fecha (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      // Validar el formato de la hora (HH:MM)
      const hourRegex = /^\d{2}:\d{2}$/;
      if (!hourRegex.test(hour)) {
        throw new BadRequestException('Invalid hour format. Use HH:MM');
      }

      // Obtener el turno existente
      const existingTurn = await this.repository.findOne({
        where: { id, deletedAt: null },
        relations: ['practitioners']
      });

      if (!existingTurn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      // Verificar si hay superposición con otros turnos
      const overlappingTurn = await this.repository
        .createQueryBuilder('appointment')
        .where('appointment.date = :date', { date })
        .andWhere('appointment.hour = :hour', { hour })
        .andWhere('appointment.id != :id', { id }) // Excluir el turno actual
        .andWhere('appointment.deletedAt IS NULL')
        .getOne();

      if (overlappingTurn) {
        throw new BadRequestException(
          'The provided date and hour overlap with an existing turn'
        );
      }

      // Actualizar el turno si no hay superposición
      Object.assign(existingTurn, updateTurnDto);
      const updatedTurn = await this.repository.save(existingTurn);

      //create notification to user segun corresponda
      //check user rol to send notification
      await this.notificationService.createNotification({
        userId: updatedTurn.patient.id,
        read: false,
        title: "Cancelacion de Turno",
        text: `Se ha cancelado un nuevo turno para el ${updateTurnDto.date} a las ${updateTurnDto.hour}`
      })

      //notification to practitioner
      for(const practitioner of updateTurnDto.practitionerIds){
        await this.notificationService.createNotification({
          userId: practitioner.id,
          read: false,
          title: "Nuevo Turno",
          text: `Se ha creado un nuevo turno para el ${updateTurnDto.date} a las ${updateTurnDto.hour}`
        })
      }

      return plainToClass(SerializerAppointmentDto, updatedTurn, {
        excludeExtraneousValues: true
      });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async validateTurn(
    hour: string,
    existingTurns: TimeDTO[],
    consultationTime: string,
    practitionerIds: string[]
  ): Promise<boolean> {
    try {
      if (!existingTurns || existingTurns.length === 0) {
        return true;
      }
  
      const newTurnTime = this.convertTimeToSeconds(hour);
      const newTurnTimeConsultation = this.convertTimeToSeconds(consultationTime);
      const newTurnEnd = newTurnTime + newTurnTimeConsultation;
  
      for (const turn of existingTurns) {
        // Skip if no practitioner_ids available
        if (!turn.practitioner_ids) {
          continue;
        }
  
        // Verificar si hay superposición de practitioners
        const existingPractitionerIds = turn.practitioner_ids.split(',');
        const hasPractitionerOverlap = practitionerIds.some(id => 
          existingPractitionerIds.includes(id)
        );
  
        // Solo validar superposición si comparten algún practitioner
        if (hasPractitionerOverlap) {
          const existingTurnTime = this.convertTimeToSeconds(turn.appointment_hour);
          const longestConsultationTime = this.convertTimeToSeconds(
            turn.consultation_time || consultationTime
          );
          const existingTurnEnd = existingTurnTime + longestConsultationTime;
  
          if (
            (newTurnTime >= existingTurnTime && newTurnTime < existingTurnEnd) ||
            (newTurnEnd > existingTurnTime && newTurnEnd <= existingTurnEnd) ||
            (newTurnTime <= existingTurnTime && newTurnEnd >= existingTurnEnd)
          ) {
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      this.logger.error(`Error validating turn: ${error}`);
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  private convertTimeToSeconds(time: any): number {
    // Si time es undefined o null, devolvemos 0 o lanzamos un error
    if (time === undefined || time === null) {
      return 0;
      // O podrías lanzar un error:
      // throw new Error('Time parameter is required');
    }

    // Si time ya es un número, asumimos que son segundos y lo devolvemos
    if (typeof time === 'number') {
      return time;
    }

    // Convertimos a string por si acaso es un número como string u otro tipo
    const timeStr = String(time);

    // Si no contiene ':', asumimos que son segundos totales
    if (!timeStr.includes(':')) {
      return parseInt(timeStr, 10) || 0;
    }

    // Manejar formatos "HH:MM" y "HH:MM:SS"
    const parts = timeStr.split(':');
    if (parts.length < 2 || parts.length > 3) {
      throw new Error(`Invalid time format: ${timeStr}. Expected "HH:MM" or "HH:MM:SS"`);
    }

    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parts.length === 3 ? (parseInt(parts[2], 10) || 0) : 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  async maxConsultationTime(appointmentId: string): Promise<string> {
    const appointment = await this.repository.findOne({
      where: { id: appointmentId },
      relations: ['practitioners']
    });

    if (!appointment || !appointment.practitioners || appointment.practitioners.length === 0) {
      return '00:30:00'; // Valor por defecto
    }

    // Obtener la máxima duración de consulta (en minutos)
    const maxDuration = Math.max(...appointment.practitioners.map(p => p.durationAppointment || 30));
    
    // Convertir minutos a formato HH:MM:SS
    const hours = Math.floor(maxDuration / 60);
    const minutes = maxDuration % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  async reprogramTurn( id: string ) : Promise<Appointment> {
    const repro = true;
    const turn = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!turn) {
      throw new NotFoundException(`Turn with ID ${id} not found`);
    }

    const x = this.removeTurn(turn.id, repro);

    return turn;
  }
}