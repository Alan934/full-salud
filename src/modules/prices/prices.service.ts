import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreatePriceDto, UpdatePriceDto } from '../../domain/dtos';
import { Price } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PricesService extends BaseService<
  Price,
  CreatePriceDto,
  UpdatePriceDto
> {
  constructor(
    @InjectRepository(Price) protected repository: Repository<Price>
  ) {
    super(repository);
  }
}
