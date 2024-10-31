// import {
//   Post,
//   Delete,
//   UploadedFile,
//   UseInterceptors,
//   Query,
//   UploadedFiles,
//   Type,
//   ParseFilePipe,
//   FileTypeValidator
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { ImagesBaseService } from '../bases/images-base/images-base.service';
// import { ImageBase } from 'src/domain/entities/image-base.entity';

// export interface IImagesController<T extends ImageBase> {
//   uploadFile(file: Express.Multer.File): Promise<T>;
//   uploadFiles(files: Express.Multer.File[]): Promise<T[]>;
//   deleteImage(publicId: string, id: string): Promise<string>;
// }

// export function ImagesControllerFactory<T extends ImageBase>(): Type<
//   IImagesController<T>
// > {
//   class ImagesController<T extends ImageBase> implements IImagesController<T> {
//     constructor(private readonly imagesService: ImagesBaseService<T>) {}

//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file'))
//     async uploadFile(
//       @UploadedFile(
//         new ParseFilePipe({
//           validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
//         })
//       )
//       file: Express.Multer.File
//     ) {
//       return this.imagesService.uploadFile(file);
//     }

//     @Post('upload-multiple')
//     @UseInterceptors(FilesInterceptor('files'))
//     async uploadFiles(
//       @UploadedFiles(
//         new ParseFilePipe({
//           validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
//         })
//       )
//       files: Express.Multer.File[]
//     ) {
//       return this.imagesService.uploadFiles(files);
//     }

//     @Delete('')
//     async deleteImage(@Query('id') id: string) {
//       return this.imagesService.deleteImage(id);
//     }
//   }
//   return ImagesController;
// }
import {
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  UploadedFiles,
  Type,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { ImagesBaseService } from '../bases/images-base/images-base.service';
import { ImageBase } from 'src/domain/entities/image-base.entity';

export interface IImagesController<T extends ImageBase> {
  uploadFile(file: Buffer, originalName: string): Promise<T>;
  uploadFiles(files: { buffer: Buffer; originalname: string }[]): Promise<T[]>;
  deleteImage(publicId: string, id: string): Promise<string>;
}

export function ImagesControllerFactory<T extends ImageBase>(): Type<IImagesController<T>> {
  class ImagesController<T extends ImageBase> implements IImagesController<T> {
    constructor(private readonly imagesService: ImagesBaseService<T>) {}

    @Post('upload')
    async uploadFile(
      @UploadedFile(
        new ParseFilePipe({
          validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })],
        }),
      )
      file: { buffer: Buffer; originalname: string }, // Cambiado a un objeto con buffer y originalname
    ) {
      if (!file || !file.buffer) {
        throw new BadRequestException('No file provided');
      }
      return this.imagesService.uploadFile(file.buffer, file.originalname);
    }

    @Post('upload-multiple')
    async uploadFiles(
      @UploadedFiles(
        new ParseFilePipe({
          validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })],
        }),
      )
      files: { buffer: Buffer; originalname: string }[], // Cambiado a un objeto con buffer y originalname
    ) {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }
      return this.imagesService.uploadFiles(files);
    }

    @Delete('')
    async deleteImage(@Query('id') id: string) {
      return this.imagesService.deleteImage(id);
    }
  }
  return ImagesController;
}
