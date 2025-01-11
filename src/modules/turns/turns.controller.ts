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
  UseInterceptors,
  Get
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';
import { TurnsService } from './turns.service';
import { Turn } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateTurnDto,
  CreateTurnDtoWithFiles,
  SerializerTurnDto,
  UpdateTurnDto
} from '../../domain/dtos';
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
import { TurnStatus } from '../../domain/enums';
import { toDto } from '../../common/util/transform-dto.util';

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

  @Post()
  @ApiOperation({ description: 'Crear un turno' })
  @ApiCreatedResponse({
    description: 'Turno creado exitosamente',
    type: SerializerTurnDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createTurn(@Body() createTurnDto: CreateTurnDto): Promise<SerializerTurnDto> {
    const turn = await this.service.createTurn(createTurnDto);
    console.log(turn);
    return toDto(SerializerTurnDto, turn);
  }
  
  @Get(':id')
  @ApiOperation({ description: 'Obtener un turno por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno encontrado', type: SerializerTurnDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async getTurnById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerTurnDto> {
    const turn = await this.service.getOne(id);
    return toDto(SerializerTurnDto, turn);
  }

  @Get()
  @ApiOperation({ description: 'Obtener todos los turnos' })
  @ApiResponse({ status: 200, description: 'Lista de turnos', type: [SerializerTurnDto] })
  async getAllTurns(): Promise<SerializerTurnDto[]> {
    const turns = await this.service.getAll();
    return turns.map((turn) => toDto(SerializerTurnDto, turn));
  }

  @Get('specialist/:specialistId')
  @ApiOperation({ description: 'Obtener turnos por el ID de un especialista' })
  @ApiParam({ name: 'specialistId', description: 'UUID del especialista', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerTurnDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el especialista' })
  async getTurnsBySpecialist(
    @Param('specialistId', new ParseUUIDPipe({ version: '4' })) specialistId: string
  ): Promise<SerializerTurnDto[]> {
    const turns = await this.service.getTurnsBySpecialist(specialistId);
    return turns.map((turn) => toDto(SerializerTurnDto, turn));
  }

  @Get('patient/:patientId')
  @ApiOperation({ description: 'Obtener turnos por el ID de un paciente' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerTurnDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el paciente' })
  async getTurnsByPatient(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string
  ): Promise<SerializerTurnDto[]> {
    const turns = await this.service.getTurnsByPatient(patientId);
    return turns.map((turn) => toDto(SerializerTurnDto, turn));
  }


  // // Ruta multipart/form-data que permite crear turno y subir imágenes.
  // @Post('with-derivation-images')
  // @ApiOperation({
  //   description: `
  // **Nota importante**: Swagger UI no maneja de forma nativa los objetos anidados, por lo que esta ruta no puede probarse correctamente a través de esta interfaz. Se recomienda probarla con Postman o similar para enviar datos con \`multipart/form-data\`.

  // Pasos para probar en Postman (con multipart/form-data):
  
  // 1. Selecciona el método POST con la URL \`/turns/with-derivation-images\`.
  // 2. En la pestaña "Headers", agregá el siguiente encabezado:
  //    - \`Content-Type: multipart/form-data\`.
  // 3. En la pestaña "Body", selecciona "form-data".
  // 4. Agrega los siguientes campos en el formulario:
  //  - Para cualquier objeto relacionado (como \`patientTurn\`, \`diagnostic\`, etc.), siempre espera un ID en formato \`[id]\` (ejemplo: \`patientTurn[id]\`).
  //    - \`date\`: Fecha del turno en formato \`YYYY-MM-DDTHH:MM:SSZ\` (ejemplo: \`2024-09-01T10:30:00Z\`).
  //    - \`observation\`: Descripción u observación sobre el turno (ejemplo: "dolor de pecho opresivo...").
  //    - \`patientTurn[id]\`: ID del turno del paciente (ejemplo: \`50436717-8608-4bff-bf41-373f14a8b888\`).
  //    - \`diagnostic[id]\`: ID del diagnóstico (ejemplo: \`50436717-8608-4bff-bf41-373f14a8b888\`).
  //    - \`specialist[id]\`: ID del especialista.
  //    - \`institution[id]\` (opcional): ID de la institución.
  //    - \`derivationImages\` (opcional): Archivos de imágenes derivadas (formatos permitidos: PNG, JPG, JPEG).
     
  //    **Nota**: Guíate por la sección \`Body\` en esta misma documentación para obtener los campos correctos que se deben incluir en la petición. Si esta descripción estuviera desactualizada, la sección \`Body\` mostrará la información más precisa.
  // `
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: CreateTurnDtoWithFiles })
  // @ApiResponse({ type: SerializerTurnDto })
  // @UseInterceptors(FilesInterceptor('derivationImages'))
  // async createWithDerivationImages(
  //   @Body() createTurnDto: CreateTurnDto,
  //   @UploadedFiles(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: /png|jpg|jpeg/ })],
  //       fileIsRequired: false
  //     })
  //   )
  //   derivationImages?: Express.Multer.File[] | null
  // ): Promise<SerializerTurnDto> {
  //   const data = await this.service.createWithDerivationImages(
  //     createTurnDto,
  //     derivationImages
  //   );
  //   return toDto(SerializerTurnDto, data);
  // }

  // @Patch('change-status/:id/:status')
  // @ApiOperation({ description: 'Actualizar el estado de un turno' })
  // @ApiNotFoundResponse({
  //   description: 'Entity not found'
  // })
  // @ApiCreatedResponse({
  //   description: 'Record updated successfully',
  //   type: SerializerTurnDto
  // })
  // @ApiParam({
  //   name: 'status',
  //   enum: TurnStatus // Para mostrar las opciones de status en swagger
  // })
  // async changeStatus(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Param('status', new ParseEnumPipe(TurnStatus)) status: TurnStatus
  // ): Promise<SerializerTurnDto> {
  //   const data = await this.service.changeStatus(id, status);

  //   return toDto(SerializerTurnDto, data);
  // }

  // @Get('specialist/:id')
  // @ApiOperation({ description: 'Obtener todos los turnos de un especialista específico' })
  // @ApiParam({ name: 'id', description: 'ID del especialista', type: 'string' })
  // @ApiResponse({ status: 200, description: 'Listado de turnos', type: [Turn] })
  // @ApiResponse({ status: 404, description: 'No turns found for specialist' })
  // async getTurnsBySpecialists(
  //   @Param('id', new ParseUUIDPipe()) specialistId: string
  // ): Promise<Turn[]> {
  //   return await this.service.getTurnsBySpecialist(specialistId);
  // }
}
