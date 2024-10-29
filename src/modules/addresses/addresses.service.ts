import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateAddressDto, UpdateAddressDto } from 'src/domain/dtos';
import { Address } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AddressesService extends BaseService<
  Address,
  CreateAddressDto,
  UpdateAddressDto
> {
  constructor(
    @InjectRepository(Address) protected repository: Repository<Address>
  ) {
    super(repository);
  }
}
