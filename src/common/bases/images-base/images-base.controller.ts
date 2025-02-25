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
  Param
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagesBaseService } from './images-base.service';
import { MediaResource } from '../../../domain/entities/MediaResource.entity';
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

@ApiBadRequestResponse({ description: 'Error: Bad Request' })
@Controller()
export class ImagesBaseController<T extends MediaResource> {
  constructor(private readonly imagesService: ImagesBaseService<T>) {}

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
            'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>'
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
        validators: [new FileTypeValidator({ fileType: '.png|jpg|jpeg' })]
      })
    )
    file: Express.Multer.File
  ) {
    return this.imagesService.uploadFile(file);
  }

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
              'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>'
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
    return this.imagesService.uploadFiles(files);
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
            'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>'
        },
        public_id: {
          type: 'string',
          example: 'image_one'
        }
      }
    }
  })
  async getImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.getImage(id);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Eliminar una imagen' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete image from Cloudinary'
  })
  @ApiOkResponse({ description: 'Image successfully deleted' })
  async deleteImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.deleteImage(id);
  }
}
