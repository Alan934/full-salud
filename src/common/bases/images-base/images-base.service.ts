import { MediaResource } from '../../../domain/entities/MediaResource.entity';
import { DeepPartial, Repository } from 'typeorm';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse
} from 'cloudinary';
import { Express } from 'express';
import 'multer';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import toStream = require('buffer-to-stream');
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';

export abstract class ImagesBaseService<T extends MediaResource> {
  private folderName: string;

  constructor(
    protected readonly repository: Repository<T>,
    folderName: string
  ) {
    this.folderName = folderName;
  }

  async uploadFile(file: Express.Multer.File): Promise<T> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const uploadResult = await new Promise<
        UploadApiResponse | UploadApiErrorResponse
      >((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: this.folderName },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        toStream(file.buffer).pipe(upload);
      });

      if ('error' in uploadResult) {
        throw new InternalServerErrorException(
          `Failed to upload image: ${uploadResult.error.message}`
        );
      }

      const imageEntity: DeepPartial<T> = {
        name: file.originalname,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      } as DeepPartial<T>;

      return await this.repository.save(imageEntity as T);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while uploading the image: ${(error as Error).message ?? 'Unknown error'}`
      );
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<T[]> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      const uploadPromises = files.map((file) => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while uploading multiple images: ${(error as Error).message ?? 'Unknown error'}`
      );
    }
  }

  async getImage(id: string): Promise<T> {
    const image = await this.repository.findOne({ where: { id } } as any);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }

  async deleteImage(id: string): Promise<string> {
    try {
      const image = await this.repository.findOne({
        where: { id }
      } as any);

      if (!image) {
        throw new NotFoundException(`Image with id ${id} not found`);
      }

      const result = await cloudinary.uploader.destroy(image.public_id);

      if (result.result !== 'ok') {
        throw new InternalServerErrorException(
          `Failed to delete image from Cloudinary: ${result.result}`
        );
      }

      await this.repository.delete(id);

      return `Image with id ${id} deleted`;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while deleting the image: ${(error as Error).message ?? 'Unknown error'}`
      );
    }
  }
}
