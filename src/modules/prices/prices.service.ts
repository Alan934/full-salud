import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreatePriceDto, UpdatePriceDto } from 'src/domain/dtos';
import { Price } from 'src/domain/entities';
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
