import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
  ParseFilePipe,
  FileTypeValidator,
  Get,
  Param,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageBase } from 'src/domain/entities/image-base.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';
import { S3Service } from './s3.service';

@ApiBadRequestResponse({ description: 'Error: Bad Request' })
@Controller()
export class S3Controller<T extends ImageBase> {
  constructor(private readonly s3Service: S3Service<T>) {}

  @Post('upload')
  @ApiOperation({ description: 'Subir una imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to upload image' })
  @ApiCreatedResponse({
    description: 'Image successfully uploaded',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'image1'
        },
        url: {
          type: 'string',
          example:
            'https://<bucket_name>.s3.<region>.amazonaws.com/<prefix>/<uuid>'
        },
        public_id: {
          type: 'string',
          example: 'image_one'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/png|image/jpg|image/jpeg' })]
      })
    )
    file: Express.Multer.File // Recibe el archivo como un objeto de Multer
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
  
    // Extrae buffer, nombre y tipo MIME del archivo
    const fileBuffer = file.buffer;
    const fileName = file.originalname;
    const mimeType = file.mimetype;
  
    // Llama al servicio con los tres parámetros requeridos
    return this.s3Service.uploadFile(fileBuffer, fileName, mimeType);
  }
  /*@UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
      })
    )
    file: Express.Multer.File
  ) {
    return this.s3Service.uploadFile(file);
  }*/

  @Post('upload-multiple')
  @ApiOperation({ description: 'Subir múltiples imágenes' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while uploading multiple images'
  })
  @ApiCreatedResponse({
    description: 'Images successfully uploaded',
    schema: {
      type: 'array',
      items: {
        properties: {
          name: {
            type: 'string',
            example: 'image1'
          },
          url: {
            type: 'string',
            example:
              'https://<bucket_name>.s3.<region>.amazonaws.com/<prefix>/<uuid>'
          },
          public_id: {
            type: 'string',
            example: 'image_one'
          }
        }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
      })
    )
    files: Express.Multer.File[]
  ) {
    return this.s3Service.uploadFiles(files);
  }

  @Get(':id')
  @ApiOperation({ description: 'Obtener una imagen' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @ApiOkResponse({
    description: 'Image found',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'image1'
        },
        url: {
          type: 'string',
          example:
            'https://<bucket_name>.s3.<region>.amazonaws.com/<prefix>/<uuid>'
        },
        public_id: {
          type: 'string',
          example: 'image_one'
        }
      }
    }
  })
  async getImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.s3Service.getImage(id);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Eliminar una imagen' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete image from Cloudinary'
  })
  @ApiOkResponse({ description: 'Image successfully deleted' })
  async deleteImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.s3Service.deleteImage(id);
  }
}
