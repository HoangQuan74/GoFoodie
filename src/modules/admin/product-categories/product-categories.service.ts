import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async save(entity: Partial<ProductCategoryEntity>) {
    return this.productCategoryRepository.save(entity);
  }

  async find(options?: FindManyOptions<ProductCategoryEntity>) {
    return this.productCategoryRepository.find(options);
  }

  async findOne(options: FindOneOptions<ProductCategoryEntity>) {
    return this.productCategoryRepository.findOne(options);
  }

  async findAndCount(options?: FindManyOptions<ProductCategoryEntity>) {
    return this.productCategoryRepository.findAndCount(options);
  }

  createQueryBuilder(alias: string) {
    return this.productCategoryRepository.createQueryBuilder(alias);
  }

  remove(entity: ProductCategoryEntity) {
    return this.productCategoryRepository.softRemove(entity);
  }

  async createProductCategoryIfNotExist(categoryId: number, storeId: number) {
    const category = await this.productCategoryRepository
      .createQueryBuilder('category')
      .where('category.id = :categoryId', { categoryId })
      .leftJoinAndSelect('category.stores', 'stores', 'stores.id = :storeId', { storeId })
      .getOne();

    if (!category) return;

    if (category.stores.length === 0) {
      await this.productCategoryRepository.createQueryBuilder('category').relation('stores').of(category).add(storeId);
    }
  }
}
