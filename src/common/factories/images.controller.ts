import {
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  UploadedFiles,
  Type,
  ParseFilePipe,
  FileTypeValidator
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagesBaseService } from '../bases/images-base/images-base.service';
import { MediaResource } from '../../domain/entities/MediaResource.entity';

export interface IImagesController<T extends MediaResource> {
  uploadFile(file: Express.Multer.File): Promise<T>;
  uploadFiles(files: Express.Multer.File[]): Promise<T[]>;
  deleteImage(publicId: string, id: string): Promise<string>;
}

export function ImagesControllerFactory<T extends MediaResource>(): Type<
  IImagesController<T>
> {
  class ImagesController<T extends MediaResource> implements IImagesController<T> {
    constructor(private readonly imagesService: ImagesBaseService<T>) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile(
        new ParseFilePipe({
          validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
        })
      )
      file: Express.Multer.File
    ) {
      return this.imagesService.uploadFile(file);
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
      @UploadedFiles(
        new ParseFilePipe({
          validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
        })
      )
      files: Express.Multer.File[]
    ) {
      return this.imagesService.uploadFiles(files);
    }

    @Delete('')
    async deleteImage(@Query('id') id: string) {
      return this.imagesService.deleteImage(id);
    }
  }
  return ImagesController;
}
