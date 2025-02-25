import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { Express } from 'express';
import 'multer';
import { ErrorManager } from '../../../../../common/exceptions/error.manager';
import { envConfig } from '../../../../../config/envs';
import { MediaResource } from '../../../../../domain/entities/MediaResource.entity';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class S3Service<T extends MediaResource> {
  private bucketName;
  private prefix: string;

  constructor(
    protected readonly s3Client: S3Client,
    protected readonly repository: Repository<T>,
    prefix: string
  ) {
    this.bucketName = envConfig.S3_BUCKET_NAME;
    this.prefix = prefix;
  }

  async uploadFile(file: Express.Multer.File): Promise<T> {
    try {
      const fileKey = `${this.prefix}/${uuidv4()}`;
      const uploadParams = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        //ACL: 'private',

        Metadata: {
          originalName: file.originalname
        }
      });

      await this.s3Client.send(uploadParams);

      const imageEntity: DeepPartial<T> = {
        name: fileKey,
        url: `https://${this.bucketName}.s3.${envConfig.S3_REGION}.amazonaws.com/${fileKey}`
      } as DeepPartial<T>;

      return await this.repository.save(imageEntity as T);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<T[]> {
    try {
      if (!files || files.length === 0) {
        throw new ErrorManager('No files provided', 400);
      }

      const uploadPromises = files.map((file) => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getImage(id: string): Promise<T> {
    const image = await this.repository.findOne({ where: { id } } as any);

    if (!image) {
      throw new ErrorManager(`Image with id ${id} not found`, 404);
    }

    return image;
  }

  async deleteImage(id: string): Promise<string> {
    try {
      const image = await this.repository.findOne({
        where: { id }
      } as any);

      if (!image) {
        throw new ErrorManager(`Image with id ${id} not found`, 404);
      }

      // Extraer la clave del archivo (fileKey) desde la URL almacenada
      const fileKey = image.name;

      const deleteParams = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey
      });

      await this.s3Client.send(deleteParams);

      // Eliminar la entrada en la base de datos
      await this.repository.delete(id);

      return `Image with id ${id} deleted successfully`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
