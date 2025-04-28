import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto
} from '../../domain/dtos';
import { PractitionerAppointment } from '../../domain/entities';
import { Repository } from 'typeorm';
import { Day } from '../../domain/enums';

@Injectable()
export class PractitionerAppointmentService extends BaseService<
  PractitionerAppointment,
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto
> {
  constructor(
    @InjectRepository(PractitionerAppointment)
    protected repository: Repository<PractitionerAppointment>
  ) {
    super(repository);
  }

  async getAll(): Promise<PractitionerAppointment[]> {
    try {
      return await this.repository.find({
        where: { deletedAt: null },
        relations: ['practitioner', 'location']
      });
    } catch (error) {
      throw new NotFoundException('Could not fetch practitioner appointments');
    }
  }

  async getOne(id: string): Promise<PractitionerAppointment> {
    try {
      const appointment = await this.repository.findOne({
        where: { id, deletedAt: null },
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
        relations: ['practitioner', 'location'],
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

  async getByPractitionerIdAndDay(practitionerId: string, day: Day): Promise<PractitionerAppointment[]> {
    try {
      const appointments = await this.repository.find({
        where: { 
          practitioner: { id: practitionerId },
          day,
          deletedAt: null 
        },
        relations: ['practitioner', 'location'],
        order: { startHour: 'ASC' }
      });

      if (!appointments || appointments.length === 0) {
        throw new NotFoundException(`No appointments found for practitioner with ID ${practitionerId} on ${day}`);
      }

      return appointments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error fetching practitioner appointments by day');
    }
  }
}