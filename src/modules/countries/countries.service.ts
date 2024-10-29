import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateCountryDto, UpdateCountryDto } from 'src/domain/dtos';
import { Country } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService extends BaseService<
  Country,
  CreateCountryDto,
  UpdateCountryDto
> {
  constructor(
    @InjectRepository(Country) protected repository: Repository<Country>
  ) {
    super(repository);
  }
}
