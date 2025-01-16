// import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
// import {
//   ApiCreatedResponse,
//   ApiOkResponse,
//   ApiOperation,
//   ApiTags
// } from '@nestjs/swagger';
// import { ControllerFactory } from '../../common/factories/controller.factory';
// import {
//   ChangeStatusApplicationDto,
//   CreateInstitutionApplicationDto,
//   SerializerHeadquartersDto,
//   SerializerInstitutionApplicationDto,
//   UpdateInstitutionApplicationDto
// } from '../../domain/dtos';
// import { InstitutionApplication } from '../../domain/entities';
// import { InstitutionApplicationsService } from './institution_applications.service';
// import { toDto } from '../../common/util/transform-dto.util';

// @ApiTags('Institution Applications')
// @Controller('institution-applications')
// export class InstitutionApplicationsController extends ControllerFactory<
//   InstitutionApplication,
//   CreateInstitutionApplicationDto,
//   UpdateInstitutionApplicationDto,
//   SerializerInstitutionApplicationDto
// >(
//   InstitutionApplication,
//   CreateInstitutionApplicationDto,
//   UpdateInstitutionApplicationDto,
//   SerializerInstitutionApplicationDto
// ) {
//   constructor(protected service: InstitutionApplicationsService) {
//     super();
//   }

//   @Patch('change-status/:id')
//   @ApiOperation({
//     description: 'Cambiar el estado de la solicitud'
//   })
//   @ApiCreatedResponse({
//     description: 'Solicitud aprobada: se crea un sede y usuario',
//     type: SerializerHeadquartersDto
//   })
//   @ApiOkResponse({
//     description: 'Record found',
//     type: SerializerInstitutionApplicationDto
//   })
//   async changeStatus(
//     @Param('id', new ParseUUIDPipe()) id: string,
//     @Body() changeStatusApplicationDto: ChangeStatusApplicationDto
//   ) {
//     const data = await this.service.changeStatus(
//       id,
//       changeStatusApplicationDto
//     );

//     if (data instanceof InstitutionApplication) {
//       return toDto(SerializerInstitutionApplicationDto, data);
//     }

//     return toDto(SerializerHeadquartersDto, data);
//   }
// }
