import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto
} from '../../domain/dtos';
import { Practitioner, PractitionerAppointment, Location } from '../../domain/entities';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { PractitionerAppointmentFilteredPaginationDto } from '../../domain/dtos/practitioner-appointment/practitioner-appointment-filtered-pagination.dto';

@Injectable()
export class PractitionerAppointmentService {
  constructor(
    @InjectRepository(PractitionerAppointment)
    protected repository: Repository<PractitionerAppointment>,
    @InjectRepository(Practitioner)
    private readonly practitionerRepository: Repository<Practitioner>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) { }

 async create(createDto: CreatePractitionerAppointmentDto): Promise<PractitionerAppointment> {
    try {
      const { practitionerId, locationId, ...appointmentData } = createDto;

      // Find existing Practitioner and Location by their IDs
      const practitioner = await this.practitionerRepository.findOne({ where: { id: practitionerId, deletedAt: null } });
      if (!practitioner) {
        throw new ErrorManager(`Practitioner with ID "${practitionerId}" not found`, 404);
      }

      const location = await this.locationRepository.findOne({ where: { id: locationId, deletedAt: null } });
      if (!location) {
        throw new ErrorManager(`Location with ID "${locationId}" not found`, 404);
      }

      // Create the new PractitionerAppointment entity
      const newAppointment = this.repository.create({
        ...appointmentData,
        practitioner: { id: practitionerId },
        location: { id: locationId },
      });

      // Save the entity
      return await this.repository.save(newAppointment);

    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllPaginated(
    filterPaginationDto: PractitionerAppointmentFilteredPaginationDto,
  ): Promise<{ data: PractitionerAppointment[]; lastPage: number; total: number; msg?: string }> {
    try {
        const { page, limit, ...filters } = filterPaginationDto;

        const queryBuilder = this.repository
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.practitioner', 'practitioner')
            .leftJoinAndSelect('appointment.location', 'location')
            .where('appointment.deletedAt IS NULL');

        // Apply filters dynamically
        if (filters.day !== undefined) {
            queryBuilder.andWhere('appointment.day = :day', { day: filters.day });
        }
        if (filters.startHour !== undefined) {
            queryBuilder.andWhere('appointment.startHour = :startHour', { startHour: filters.startHour });
        }
        if (filters.endHour !== undefined) {
            queryBuilder.andWhere('appointment.endHour = :endHour', { endHour: filters.endHour });
        }
        if (filters.practitionerId !== undefined) {
            queryBuilder.andWhere('practitioner.id = :practitionerId', { practitionerId: filters.practitionerId });
        }
        if (filters.locationId !== undefined) {
            queryBuilder.andWhere('location.id = :locationId', { locationId: filters.locationId });
        }

        queryBuilder.orderBy('appointment.day', 'ASC')
                     .addOrderBy('appointment.startHour', 'ASC');

        queryBuilder.skip((page - 1) * limit).take(limit);

        const [appointments, total] = await queryBuilder.getManyAndCount();

        const lastPage = Math.ceil(total / limit);
        let msg = '';
        if (total === 0) msg = 'No practitioner appointments found matching the criteria';

        return { data: appointments, lastPage, total, msg };

    } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<PractitionerAppointment> {
    try {
      const appointment = await this.repository.findOne({
        where: { id },
        relations: ['practitioner', 'location']
      });

      if (!appointment) {
        throw new NotFoundException(`Practitioner appointment with ID ${id} not found`);
      }

      return appointment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error fetching practitioner appointment');
    }
  }

  async getByPractitionerId(practitionerId: string): Promise<PractitionerAppointment[]> {
    try {
      const appointments = await this.repository.find({
        where: { 
          practitioner: { id: practitionerId },
          deletedAt: null 
        },
        order: { day: 'ASC', startHour: 'ASC' }
      });

      if (!appointments || appointments.length === 0) {
        throw new NotFoundException(`No appointments found for practitioner with ID ${practitionerId}`);
      }

      return appointments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error fetching practitioner appointments');
    }
  }

  async update(id: string, updateDto: UpdatePractitionerAppointmentDto): Promise<PractitionerAppointment> {
    try {
        const existingAppointment = await this.getOne(id);

        const { practitionerId, locationId, ...updateData } = updateDto;

        if (practitionerId !== undefined) {
            const practitioner = await this.practitionerRepository.findOne({ where: { id: practitionerId } });
            if (!practitioner) {
                throw new ErrorManager(`Practitioner with ID "${practitionerId}" not found or is soft-deleted`, 404);
            }
            existingAppointment.practitioner = practitioner;
        }

        if (locationId !== undefined) {
            const location = await this.locationRepository.findOne({ where: { id: locationId } as FindOptionsWhere<Location>, });
            if (!location) {
                throw new ErrorManager(`Location with ID "${locationId}" not found or is soft-deleted`, 404);
            }
            existingAppointment.locationId = locationId;
        }

        Object.assign(existingAppointment, updateData);

        return await this.repository.save(existingAppointment);

    } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDeleted(id: string): Promise<{ message: string }> {
    try {
        const appointment = await this.getOne(id);

        await this.repository.softRemove(appointment);

        return { message: `Practitioner appointment with ID "${id}" soft deleted successfully` };
    } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recover(id: string): Promise<PractitionerAppointment> {
    try {
        const appointment = await this.repository.findOne({
            where: { id },
            withDeleted: true,
            relations: ['practitioner', 'location']
        });

        if (!appointment) {
            throw new ErrorManager(`Practitioner appointment with ID "${id}" not found`, 404);
        }

        if (!appointment.deletedAt) {
            throw new ErrorManager(`Practitioner appointment with ID "${id}" is not soft-deleted`, 400);
        }

        await this.repository.recover(appointment);

        return await this.repository.findOne({
           where: { id },
           relations: ['practitioner', 'location']
        });

    } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}