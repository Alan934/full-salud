// import {
//   Body,
//   Controller,
//   FileTypeValidator,
//   Get,
//   HttpCode,
//   HttpStatus,
//   ParseFilePipe,
//   Post,
//   Query,
//   UploadedFile,
//   UseInterceptors
// } from '@nestjs/common';
// import { Express } from 'express';
// import 'multer';
// import { ControllerFactory } from '../../common/factories/controller.factory';
// import {
//   UserDto,
//   SerializerUserDto,
//   UpdateUserDto,
//   UserPaginationDto
// } from '../../domain/dtos';
// import { AuthService } from './auth.service';
// import {
//   ApiBody,
//   ApiConsumes,
//   ApiOperation,
//   ApiResponse,
//   ApiTags
// } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { toDto, toDtoList } from '../../common/util/transform-dto.util';
// import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
// import { PaginationMetadata } from '../../common/util/pagination-data.util';
// import { User } from 'src/domain/entities';

// @ApiTags('Auth')
// @Controller('auth')
// export class AuthController extends ControllerFactory<
//   User,
//   UserDto,
//   UpdateUserDto,
//   SerializerUserDto
// >(User, UserDto, UpdateUserDto, SerializerUserDto) {
//   constructor(protected service: AuthService) {
//     super();
//   }

//   // Ruta multipart/form-data que permite crear usurio y subir imágenes.
//   @Post('with-profile-image')
//   @ApiOperation({
//     description: `
//   **Nota importante**: Swagger UI no maneja de forma nativa los objetos anidados, por lo que esta ruta no puede probarse correctamente a través de esta interfaz. Se recomienda probarla con Postman o similar para enviar datos con \`multipart/form-data\`.

//   Pasos para probar en Postman (con multipart/form-data):
  
//   1. Selecciona el método POST con la URL \`/auth/with-profile-image\`.
//   2. En la pestaña "Headers", agregá el siguiente encabezado:
//      - \`Content-Type: multipart/form-data\`.
//   3. En la pestaña "Body", selecciona "form-data".
//   4. Agrega los siguientes campos en el formulario:
//      - \`phone\`: Número de celular del usuario (ejemplo: \`2615836294\`).
//      - \`email\`: Correo electrónico del usuario (ejemplo: \`juan@example.com\`).
//      - \`username\`: Nombre de usuario (ejemplo: \`juan123\`).
//      - \`password\`: Contraseña del usuario (ejemplo: \`Clave1*\`).
//      - \`role\`: Rol del usuario (ejemplo: \`patient\` o \`admin\`).
//      - \`addresses\`: Información de la dirección en formato JSON (si aplica), por ejemplo:
//      - \`addresses[0][id]\`: ID de la primera dirección.
//      - \`profileImage\` (opcional): Archivo de imagen de perfil (formatos permitidos: PNG, JPG, JPEG). Asegúrate de seleccionar un archivo válido en el formato requerido.
     
//      **Nota**: Guíate por la sección \`Body\` en esta misma documentación para obtener los campos correctos que se deben incluir en la petición. Si esta descripción estuviera desactualizada, la sección \`Body\` mostrará la información más precisa.
//   `
//   })
//   @ApiConsumes('multipart/form-data')
//   @ApiResponse({ type: SerializerUserDto })
//   @UseInterceptors(FileInterceptor('profileImage'))
//   async createWithDerivationImages(
//     @Body() UserDto: UserDto,
//     @UploadedFile(
//       new ParseFilePipe({
//         validators: [new FileTypeValidator({ fileType: /png|jpg|jpeg/ })], // Valida el tipo de archivo
//         fileIsRequired: false // Indica que el archivo es opcional
//       })
//     )
//     profileImage?: Express.Multer.File | null
//   ): Promise<SerializerUserDto> {
//     const data = await this.service.createWithProfileImage(
//       UserDto,
//       profileImage
//     );
//     return toDto(SerializerUserDto, data); // Parsea la entidad a dto
//   }

//   @Get()
//   @ApiOperation({
//     description: 'Obtener users paginados con filtros opcionales'
//   })
//   @ApiPaginationResponse(SerializerUserDto)
//   override async findAll(
//     @Query()
//     paginationDto: UserPaginationDto
//   ): Promise<{ data: SerializerUserDto[]; meta: PaginationMetadata }> {
//     const { data, meta } = await this.service.findAll(paginationDto);
//     const serializedData = toDtoList(SerializerUserDto, data);
//     return { data: serializedData, meta };
//   }

//   @Post('create')
//   @ApiOperation({ summary: 'Crear un nuevo usuario' })
//   @ApiBody({ type: UserDto })
//   @ApiResponse({ type: SerializerUserDto })
//   async create(@Body() UserDto: UserDto): Promise<SerializerUserDto> {
//     const data = await this.service.create(UserDto);
//     return toDto(SerializerUserDto, data);
//   }

//   @Post('login')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Iniciar sesión' })
//   @ApiBody({
//     description: 'Credenciales de login',
//     type: Object,
//     examples: {
//       success: {
//         value: { email: 'juan@example.com', password: 'Clave1*' }
//       }
//     }
//   })
//   @ApiResponse({ description: 'Login exitoso', type: SerializerUserDto })
//   @ApiResponse({
//     status: HttpStatus.UNAUTHORIZED,
//     description: 'Credenciales inválidas'
//   })
//   async login(
//     @Body() loginDto: { email: string; password: string }
//   ): Promise<SerializerUserDto> {
//     const user = await this.service.login(loginDto.email, loginDto.password);
//     return toDto(SerializerUserDto, user);
//   }
// }
