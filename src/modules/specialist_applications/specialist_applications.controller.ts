import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  ChangeStatusApplicationDto,
  CreateSpecialistApplicationDto,
  SerializerSpecialistApplicationDto,
  SerializerSpecialistDto,
  UpdateSpecialistApplicationDto
} from '../../domain/dtos';
import { SpecialistApplication } from '../../domain/entities';
import { SpecialistApplicationsService } from './specialist_applications.service';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Specialist Applications')
@Controller('specialist-applications')
export class SpecialistApplicationsController extends ControllerFactory<
  SpecialistApplication,
  CreateSpecialistApplicationDto,
  UpdateSpecialistApplicationDto,
  SerializerSpecialistApplicationDto
>(
  SpecialistApplication,
  CreateSpecialistApplicationDto,
  UpdateSpecialistApplicationDto,
  SerializerSpecialistApplicationDto
) {
  constructor(protected service: SpecialistApplicationsService) {
    super();
  }
 
  //Verificar que hacer con esto despues

  // @Patch('change-status/:id')
  // @ApiOperation({
  //   description: 'Cambiar el estado de la solicitud'
  // })
  // @ApiCreatedResponse({
  //   description: 'Solicitud aprobada: se crea especialista y usuario',
  //   type: SerializerSpecialistDto
  // })
  // @ApiOkResponse({
  //   description: 'Record found',
  //   type: SerializerSpecialistApplicationDto
  // })
  // async changeStatus(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() changeStatusApplicationDto: ChangeStatusApplicationDto
  // ) {
  //   const data = await this.service.changeStatus(
  //     id,
  //     changeStatusApplicationDto
  //   );

  //   if (data instanceof SpecialistApplication) {
  //     return toDto(SerializerSpecialistApplicationDto, data);
  //   }

  //   return toDto(SerializerSpecialistDto, data);
  // }
}
