import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { ProductView } from 'src/database/views/product.view';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(ProductView)
    private readonly productViewRepository: Repository<ProductView>,
  ) {}

  createQueryBuilder(alias: string) {
    return this.productRepository.createQueryBuilder(alias);
  }

  async findOne(options: FindOneOptions<ProductEntity>) {
    return this.productRepository.findOne(options);
  }

  createQueryBuilderView(alias: string) {
    return this.productViewRepository.createQueryBuilder(alias);
  }
}
