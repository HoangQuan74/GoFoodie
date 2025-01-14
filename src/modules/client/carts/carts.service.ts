import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/database/entities/cart.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  async save(entity: DeepPartial<CartEntity>) {
    return this.cartRepository.save(entity);
  }

  async findOne(options: FindOneOptions<CartEntity>) {
    return this.cartRepository.findOne(options);
  }

  async find(options?: FindManyOptions<CartEntity>) {
    return this.cartRepository.find(options);
  }

  async remove(entity: CartEntity) {
    return this.cartRepository.remove(entity);
  }
}
