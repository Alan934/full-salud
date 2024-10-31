import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateTurnDto, UpdateTurnDto } from '../../domain/dtos';
import { PatientUserConnection, Turn } from '../../domain/entities';
import { TurnStatus } from '../../domain/enums';
import { Express } from 'express';
import 'multer';
import { EntityManager, Repository } from 'typeorm';
import { DerivationImagesService } from '../derivation_images/derivation_images.service';

@Injectable()
export class TurnsService extends BaseService<
  Turn,
  CreateTurnDto,
  UpdateTurnDto
> {
  constructor(
    @InjectRepository(Turn) protected repository: Repository<Turn>,
    private readonly derivationImagesService: DerivationImagesService
  ) {
    super(repository);
  }

  // Método que sube imágenes y se las asigna al nuevo turno
  async createWithDerivationImages(
    createTurnDto: CreateTurnDto,
    files?: Express.Multer.File[] | null // Es opcional recibir imágenes
  ): Promise<Turn> {
    // Inicia transacción
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let derivationImages = [];
    try {
      // Verifica que files no sea nulo
      if (files && files.length > 0) {
        // Crea y sube las imágenes
        derivationImages =
          await this.derivationImagesService.uploadFiles(files);
      }

      // Guarda el objeto en memoria con las imágenes
      const newTurn = queryRunner.manager.create(Turn, {
        ...createTurnDto,
        derivationImages
      });

      // Guarda el objeto en la base de datos
      const insertTurn = await queryRunner.manager.save(newTurn);

      await queryRunner.commitTransaction();

      return await this.findOne(insertTurn.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Eliminar las imágenes subidas si la transacción falla
      if (derivationImages && derivationImages.length > 0) {
        derivationImages.map((image) =>
          this.derivationImagesService.deleteImage(image.id)
        );
      }
      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      await queryRunner.release();
    }
  }

  override async remove(id: string): Promise<string> {
    try {
      const turn = await this.findOne(id); // Verifica que la entidad existe
      const derivationImagesIds = turn.derivationImages
        ? turn.derivationImages.map((image) => image.id)
        : null; // Obtiene los ids de las imágenes

      // Inicia la transacción
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.remove(turn); // Elimina el turno

          // Elimina las imágenes pasandole los ids
          if (derivationImagesIds.length > 0) {
            derivationImagesIds.map((imageId) =>
              this.derivationImagesService.deleteImage(imageId)
            );
          }

          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager): Promise<string> {
    try {
      const turn = await manager.findOne(Turn, {
        where: { id }
      }); // Verifica que la entidad existes
      const derivationImagesIds = turn.derivationImages
        ? turn.derivationImages.map((image) => image.id)
        : null; // Obtiene los ids de las imágenes

      await manager.remove(turn); // Elimina el turno

      // Elimina las imágenes pasandole los ids
      if (derivationImagesIds.length > 0) {
        derivationImagesIds.map((imageId) =>
          this.derivationImagesService.deleteImage(imageId)
        );
      }

      return `Entity with id ${id} deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async changeStatus(id: string, status: TurnStatus) {
    const turn = await this.findOne(id);

    // Verifica si el estado ya es el mismo, si es así, no se hacen cambios
    if (turn.status === status) {
      return turn;
    }

    // Asigna el nuevo status
    turn.status = status;

    return await this.repository.save(turn);
  }

  async removeByPatientWithManager(
    patientTurnId: string,
    manager: EntityManager
  ): Promise<string> {
    try {
      const turns: Turn[] = await manager
        .createQueryBuilder()
        .select(['turn.id'])
        .from(Turn, 'turn')
        .leftJoin(PatientUserConnection, 'patient_user_connections')
        .where('patient_turn_id = :id', { id: patientTurnId })
        .execute();

      await Promise.all(
        turns.map(
          async (turn) => await this.removeWithManager(turn.id, manager)
        )
      );
      return `Turn of patient with id ${patientTurnId} deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
