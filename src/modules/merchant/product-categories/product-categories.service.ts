import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async find(options?: FindManyOptions<ProductCategoryEntity>): Promise<ProductCategoryEntity[]> {
    return this.productCategoryRepository.find(options);
  }

  async findOne(options: FindManyOptions<ProductCategoryEntity>): Promise<ProductCategoryEntity> {
    return this.productCategoryRepository.findOne(options);
  }

  async findAndCount(options?: FindManyOptions<ProductCategoryEntity>): Promise<[ProductCategoryEntity[], number]> {
    return this.productCategoryRepository.findAndCount(options);
  }

  async count(options?: FindManyOptions<ProductCategoryEntity>): Promise<number> {
    return this.productCategoryRepository.count(options);
  }

  async save(data: Partial<ProductCategoryEntity>): Promise<ProductCategoryEntity> {
    return this.productCategoryRepository.save(data);
  }

  createQueryBuilder(alias: string) {
    return this.productCategoryRepository.createQueryBuilder(alias);
  }

  async remove(entity: ProductCategoryEntity): Promise<ProductCategoryEntity> {
    return this.productCategoryRepository.remove(entity);
  }
}
