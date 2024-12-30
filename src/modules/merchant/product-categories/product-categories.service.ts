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

  createQueryBuilder(alias: string) {
    return this.productCategoryRepository.createQueryBuilder(alias);
  }
}
