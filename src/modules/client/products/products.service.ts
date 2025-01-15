import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  createQueryBuilder(alias: string) {
    return this.productRepository.createQueryBuilder(alias);
  }

  async findOne(options: FindOneOptions<ProductEntity>) {
    return this.productRepository.findOne(options);
  }
}
