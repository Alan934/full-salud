import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../../domain/dtos';
import { Prescription, Specialist } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PrescriptionsService extends BaseService<
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto
> {
  constructor(
    @InjectRepository(Prescription)
    protected repository: Repository<Prescription>
  ) {
    super(repository);
  }

  //sobrescribe el método base create para añadir validación si el especialista puede prescribir
  override async create(
    createDto: CreatePrescriptionDto
  ): Promise<Prescription> {
    try {
      return await this.repository.manager.transaction(
        async (entityManager: EntityManager) => {
          //obtener el especialista de la base de datos según el id pasado en el dto
          const specialist: Specialist = await entityManager.findOne(
            Specialist,
            {
              where: { id: createDto.specialist.id }
            }
          );

          //valido si en la especialidad del especialista obtenido el atributo canPrescribe es true
          if (specialist.speciality.canPrescribe) {
            //validar si indications y observations no existen en createDto, debe existir al menos una de las dos
            if (!createDto.indications && !createDto.observations) {
              throw new ErrorManager(
                'Either indications field or observations field must not be empty',
                HttpStatus.BAD_REQUEST
              );
            }
            //si canPrescribe es false
          } else {
            //validar si indications existe y si observations no existe
            if (createDto.indications) {
              throw new ErrorManager(
                'Specialist is not authorized to prescribe medicine',
                HttpStatus.BAD_REQUEST
              );
            } else if (!createDto.observations) {
              throw new ErrorManager(
                'Observations field must not be empty',
                HttpStatus.BAD_REQUEST
              );
            }
          }

          //crear prescription
          const newPrescription = entityManager.create(Prescription, createDto);
          return await entityManager.save(newPrescription);
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
