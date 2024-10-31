import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateUserDto,
  CreateUserDtoWithFiles,
  SerializerUserDto,
  UpdateUserDto,
  UserPaginationDto
} from '../../domain/dtos';
import { User } from '../../domain/entities';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { toDto, toDtoList } from '../../common/util/transform-dto.util';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { PaginationMetadata } from '../../common/util/pagination-data.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends ControllerFactory<
  User,
  CreateUserDto,
  UpdateUserDto,
  SerializerUserDto
>(User, CreateUserDto, UpdateUserDto, SerializerUserDto) {
  constructor(protected service: AuthService) {
    super();
  }

  // Ruta multipart/form-data que permite crear usurio y subir imágenes.
  @Post('with-profile-image')
  @ApiOperation({
    description: `
  **Nota importante**: Swagger UI no maneja de forma nativa los objetos anidados, por lo que esta ruta no puede probarse correctamente a través de esta interfaz. Se recomienda probarla con Postman o similar para enviar datos con \`multipart/form-data\`.

  Pasos para probar en Postman (con multipart/form-data):
  
  1. Selecciona el método POST con la URL \`/auth/with-profile-image\`.
  2. En la pestaña "Headers", agregá el siguiente encabezado:
     - \`Content-Type: multipart/form-data\`.
  3. En la pestaña "Body", selecciona "form-data".
  4. Agrega los siguientes campos en el formulario:
     - \`phone\`: Número de celular del usuario (ejemplo: \`2615836294\`).
     - \`email\`: Correo electrónico del usuario (ejemplo: \`juan@example.com\`).
     - \`username\`: Nombre de usuario (ejemplo: \`juan123\`).
     - \`password\`: Contraseña del usuario (ejemplo: \`Clave1*\`).
     - \`role\`: Rol del usuario (ejemplo: \`patient\` o \`admin\`).
     - \`addresses\`: Información de la dirección en formato JSON (si aplica), por ejemplo:
     - \`addresses[0][id]\`: ID de la primera dirección.
     - \`profileImage\` (opcional): Archivo de imagen de perfil (formatos permitidos: PNG, JPG, JPEG). Asegúrate de seleccionar un archivo válido en el formato requerido.
     
     **Nota**: Guíate por la sección \`Body\` en esta misma documentación para obtener los campos correctos que se deben incluir en la petición. Si esta descripción estuviera desactualizada, la sección \`Body\` mostrará la información más precisa.
  `
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDtoWithFiles })
  @ApiResponse({ type: SerializerUserDto })
  @UseInterceptors(FileInterceptor('profileImage'))
  async createWithDerivationImages(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /png|jpg|jpeg/ })], // Valida el tipo de archivo
        fileIsRequired: false // Indica que el archivo es opcional
      })
    )
    profileImage?: Express.Multer.File | null
  ): Promise<SerializerUserDto> {
    const data = await this.service.createWithProfileImage(
      createUserDto,
      profileImage
    );
    return toDto(SerializerUserDto, data); // Parsea la entidad a dto
  }

  @Get()
  @ApiOperation({
    description: 'Obtener users paginados con filtros opcionales'
  })
  @ApiPaginationResponse(SerializerUserDto)
  override async findAll(
    @Query()
    paginationDto: UserPaginationDto
  ): Promise<{ data: SerializerUserDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAll(paginationDto);
    const serializedData = toDtoList(SerializerUserDto, data);
    return { data: serializedData, meta };
  }
}
