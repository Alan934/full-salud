import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { TurnsService } from './turns.service';
import { Turn } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateTurnDto,
  CreateTurnDtoWithFiles,
  SerializerTurnDto,
  UpdateTurnDto
} from 'src/domain/dtos';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TurnStatus } from 'src/domain/enums';
import { toDto } from 'src/common/util/transform-dto.util';

@ApiTags('Turns')
@Controller('turns')
export class TurnsController extends ControllerFactory<
  Turn,
  CreateTurnDto,
  UpdateTurnDto,
  SerializerTurnDto
>(Turn, CreateTurnDto, UpdateTurnDto, SerializerTurnDto) {
  constructor(protected service: TurnsService) {
    super();
  }

  // Ruta multipart/form-data que permite crear turno y subir imágenes.
  @Post('with-derivation-images')
  @ApiOperation({
    description: `
  **Nota importante**: Swagger UI no maneja de forma nativa los objetos anidados, por lo que esta ruta no puede probarse correctamente a través de esta interfaz. Se recomienda probarla con Postman o similar para enviar datos con \`multipart/form-data\`.

  Pasos para probar en Postman (con multipart/form-data):
  
  1. Selecciona el método POST con la URL \`/turns/with-derivation-images\`.
  2. En la pestaña "Headers", agregá el siguiente encabezado:
     - \`Content-Type: multipart/form-data\`.
  3. En la pestaña "Body", selecciona "form-data".
  4. Agrega los siguientes campos en el formulario:
   - Para cualquier objeto relacionado (como \`patientTurn\`, \`diagnostic\`, etc.), siempre espera un ID en formato \`[id]\` (ejemplo: \`patientTurn[id]\`).
     - \`date\`: Fecha del turno en formato \`YYYY-MM-DDTHH:MM:SSZ\` (ejemplo: \`2024-09-01T10:30:00Z\`).
     - \`observation\`: Descripción u observación sobre el turno (ejemplo: "dolor de pecho opresivo...").
     - \`patientTurn[id]\`: ID del turno del paciente (ejemplo: \`50436717-8608-4bff-bf41-373f14a8b888\`).
     - \`diagnostic[id]\`: ID del diagnóstico (ejemplo: \`50436717-8608-4bff-bf41-373f14a8b888\`).
     - \`specialist[id]\`: ID del especialista.
     - \`institution[id]\` (opcional): ID de la institución.
     - \`derivationImages\` (opcional): Archivos de imágenes derivadas (formatos permitidos: PNG, JPG, JPEG).
     
     **Nota**: Guíate por la sección \`Body\` en esta misma documentación para obtener los campos correctos que se deben incluir en la petición. Si esta descripción estuviera desactualizada, la sección \`Body\` mostrará la información más precisa.
  `
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTurnDtoWithFiles })
  @ApiResponse({ type: SerializerTurnDto })
  @UseInterceptors(FilesInterceptor('derivationImages'))
  async createWithDerivationImages(
    @Body() createTurnDto: CreateTurnDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /png|jpg|jpeg/ })], // Valida el tipo de archivo
        fileIsRequired: false // Indica que el archivo es opcional
      })
    )
    derivationImages?: Express.Multer.File[] | null
  ): Promise<SerializerTurnDto> {
    const data = await this.service.createWithDerivationImages(
      createTurnDto,
      derivationImages
    );
    return toDto(SerializerTurnDto, data); // Parsea la entidad a dto
  }

  @Patch('change-status/:id/:status')
  @ApiOperation({ description: 'Actualizar el estado de un turno' })
  @ApiNotFoundResponse({
    description: 'Entity not found'
  })
  @ApiCreatedResponse({
    description: 'Record updated successfully',
    type: SerializerTurnDto
  })
  @ApiParam({
    name: 'status',
    enum: TurnStatus // Para mostrar las opciones de status en swagger
  })
  async changeStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('status', new ParseEnumPipe(TurnStatus)) status: TurnStatus
  ): Promise<SerializerTurnDto> {
    const data = await this.service.changeStatus(id, status);

    return toDto(SerializerTurnDto, data);
  }
}
