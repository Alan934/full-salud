import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateDisabilityCardDto,
  UpdateDisabilityCardDto
} from 'src/domain/dtos';
import { DisabilityCard } from 'src/domain/entities';
import { EntityManager, Repository } from 'typeorm';
import { DisabilityCardImagesService } from '../disability_card_images/disability_card_images.service';
import { ErrorManager } from 'src/common/exceptions/error.manager';

@Injectable()
export class DisabilityCardsService extends BaseService<
  DisabilityCard,
  CreateDisabilityCardDto,
  UpdateDisabilityCardDto
> {
  constructor(
    @InjectRepository(DisabilityCard)
    protected repository: Repository<DisabilityCard>,
    private readonly disabilityCardImagesService: DisabilityCardImagesService
  ) {
    super(repository);
  }

  // Método que sube imágenes y se las asigna a la nueva credencial de discapacidad
  async createWithDisabilityCardImages(
    createDisabilityCardDto: CreateDisabilityCardDto,
    files?: Express.Multer.File[] | null // Es opcional recibir imágenes
  ): Promise<DisabilityCard> {
    // Inicia transacción
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let disabilityCardImages = [];
    try {
      // Verifica que files no sea nulo
      if (files && files.length > 0) {
        // Crea y sube las imágenes
        disabilityCardImages =
          await this.disabilityCardImagesService.uploadFiles(files);
      }

      // Guarda el objeto en memoria con las imágenes
      const newTurn = queryRunner.manager.create(DisabilityCard, {
        ...createDisabilityCardDto,
        disabilityCardImages
      });

      // Guarda el objeto en la base de datos
      const insertTurn = await queryRunner.manager.save(newTurn);

      await queryRunner.commitTransaction();

      return await this.findOne(insertTurn.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Eliminar las imágenes subidas si la transacción falla
      if (disabilityCardImages && disabilityCardImages.length > 0) {
        disabilityCardImages.map((image) =>
          this.disabilityCardImagesService.deleteImage(image.id)
        );
      }
      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const disabilityCard = await this.findOne(id); // Verifica que la entidad existe

      const disabilityCardImagesIds = disabilityCard.disabilityCardImages
        ? disabilityCard.disabilityCardImages.map((image) => image.id)
        : null; // Obtiene los ids de las imágenes

      // Inicia la transacción
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.remove(disabilityCard); // Elimina disability_card

          // Elimina las imágenes pasandole los ids
          if (disabilityCardImagesIds.length > 0) {
            disabilityCardImagesIds.map((imageId) =>
              this.disabilityCardImagesService.deleteImage(imageId)
            );
          }

          return `Disability card with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager) {
    try {
      const disabilityCard = await manager.findOne(DisabilityCard, {
        where: { id }
      });

      const disabilityCardImagesIds = disabilityCard.disabilityCardImages
        ? disabilityCard.disabilityCardImages.map((image) => image.id)
        : null; // Obtiene los ids de las imágenes

      await manager.remove(disabilityCard); // Elimina disability_card

      // Elimina las imágenes pasandole los ids
      if (disabilityCardImagesIds.length > 0) {
        disabilityCardImagesIds.map((imageId) =>
          this.disabilityCardImagesService.deleteImage(imageId)
        );
      }
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
