import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async save(entity: DeepPartial<ProductEntity>) {
    return this.productRepository.save(entity);
  }

  async find(options?: FindManyOptions<ProductEntity>) {
    return this.productRepository.find(options);
  }

  async findAndCount(options?: FindManyOptions<ProductEntity>) {
    return this.productRepository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<ProductEntity>) {
    return this.productRepository.findOne(options);
  }

  async remove(entity: ProductEntity) {
    return this.productRepository.softRemove(entity);
  }

  async createQueryBuilder(alias?: string) {
    return this.productRepository.createQueryBuilder(alias);
  }
}
