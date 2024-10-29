import { Controller } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateCountryDto,
  SerializerCountryDto,
  UpdateCountryDto
} from 'src/domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController extends ControllerFactory<
  Country,
  CreateCountryDto,
  UpdateCountryDto,
  SerializerCountryDto
>(Country, CreateCountryDto, UpdateCountryDto, SerializerCountryDto) {
  constructor(protected service: CountriesService) {
    super();
  }
}
