import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Express } from 'express';
import 'multer';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateDisabilityCardDto,
  UpdateDisabilityCardDto,
  SerializerDisabilityCardDto,
  CreateDisabilityCardDtoWithFiles
} from '../../domain/dtos';
import { DisabilityCard } from '../../domain/entities';
import { DisabilityCardsService } from './disability_cards.service';
import { toDto } from '../../common/util/transform-dto.util';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Disability Cards')
@Controller('disability-cards')
export class DisabilityCardsController extends ControllerFactory<
  DisabilityCard,
  CreateDisabilityCardDto,
  UpdateDisabilityCardDto,
  SerializerDisabilityCardDto
>(
  DisabilityCard,
  CreateDisabilityCardDto,
  UpdateDisabilityCardDto,
  SerializerDisabilityCardDto
) {
  constructor(protected service: DisabilityCardsService) {
    super();
  }

  // Ruta multipart/form-data que permite crear disability card y subir imágenes.
  @Post('with-disability-card-images')
  @ApiOperation({
    description: `
  **Nota importante**: Swagger UI no maneja de forma nativa los objetos anidados, por lo que esta ruta no puede probarse correctamente a través de esta interfaz. Se recomienda probarla con Postman o similar para enviar datos con \`multipart/form-data\`.

  Pasos para probar en Postman (con multipart/form-data):
  
  1. Selecciona el método POST con la URL \`/disability-cards/with-disability-card-images\`.
  2. En la pestaña "Headers", agregá el siguiente encabezado:
     - \`Content-Type: multipart/form-data\`.
  3. En la pestaña "Body", selecciona "form-data".
  4. Agrega los siguientes campos en el formulario:
     - \`cardNumber\`: Número del carnet (ejemplo: \`123456789\`).
     - \`expirationDate\`: Fecha de epiración del carnet (ejemplo: \`2024-12-31T23:59:59Z\`).
     - \`disabilityCardImages\` (opcional): Archivos de imágenes de carnet de discapacidad (formatos permitidos: PNG, JPG, JPEG).
     - \`patientTurn[id]\`: Id de PatientTurn al que pertenece el carnet de discapacidad. 
     
     **Nota**: Guíate por la sección \`Body\` en esta misma documentación para obtener los campos correctos que se deben incluir en la petición. Si esta descripción estuviera desactualizada, la sección \`Body\` mostrará la información más precisa.
  `
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDisabilityCardDtoWithFiles })
  @ApiResponse({ type: SerializerDisabilityCardDto })
  @UseInterceptors(FilesInterceptor('disabilityCardImages'))
  async createWithDerivationImages(
    @Body() createDisabilityCardDto: CreateDisabilityCardDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /png|jpg|jpeg/ })], // Valida tipo de archivo
        fileIsRequired: false // Indica que el archivo es opcional
      })
    )
    disabilityCardImages?: Express.Multer.File[] | null
  ): Promise<SerializerDisabilityCardDto> {
    const data = await this.service.createWithDisabilityCardImages(
      createDisabilityCardDto,
      disabilityCardImages
    );
    return toDto(SerializerDisabilityCardDto, data); // Parsea la entidad a dto
  }
}
