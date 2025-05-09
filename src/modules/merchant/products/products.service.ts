import { Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/database/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(ProductApprovalEntity)
    private readonly productApprovalRepository: Repository<ProductApprovalEntity>,
  ) {}

  async save(entity: DeepPartial<ProductEntity>) {
    return this.productRepository.save(entity);
  }

  async find(options?: FindManyOptions<ProductEntity>) {
    return this.productRepository.find(options);
  }

  async findOne(options: FindOneOptions<ProductEntity>) {
    return this.productRepository.findOne(options);
  }

  async count(options?: FindManyOptions<ProductEntity>) {
    return this.productRepository.count(options);
  }

  createQueryBuilder(alias: string) {
    return this.productRepository.createQueryBuilder(alias);
  }

  async update(options: FindOptionsWhere<ProductEntity>, data: DeepPartial<ProductEntity>) {
    return this.productRepository.update(options, data);
  }

  async remove(entity: ProductEntity | ProductEntity[]) {
    if (Array.isArray(entity)) {
      return this.productRepository.remove(entity);
    }
    return this.productRepository.remove(entity);
  }

  async saveProductApproval(entity: DeepPartial<ProductApprovalEntity>) {
    await this.productApprovalRepository.softDelete({ productId: entity.productId });
    return this.productApprovalRepository.save(entity);
  }

  async findOneProductApproval(options: FindOneOptions<ProductApprovalEntity>) {
    return this.productApprovalRepository.findOne(options);
  }
}
