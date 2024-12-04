import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOptionGroupEntity } from 'src/database/entities/product-option-group.entity';

@Injectable()
export class ProductOptionGroupsService {
  constructor(
    @InjectRepository(ProductOptionGroupEntity)
    private productOptionGroupRepository: Repository<ProductOptionGroupEntity>,
  ) {}

  async save(
    entity?: DeepPartial<ProductOptionGroupEntity | ProductOptionGroupEntity[]>,
  ): Promise<ProductOptionGroupEntity | ProductOptionGroupEntity[]> {
    if (Array.isArray(entity)) {
      return this.productOptionGroupRepository.save(entity);
    }
    return this.productOptionGroupRepository.save(entity);
  }

  async remove(entities: ProductOptionGroupEntity[]): Promise<ProductOptionGroupEntity[]> {
    return this.productOptionGroupRepository.softRemove(entities);
  }

  async removeAllProduct(groupId: number): Promise<void> {
    const productOptions = await this.productOptionGroupRepository.find({
      where: { optionGroupId: groupId },
      relations: ['options'],
    });

    await this.productOptionGroupRepository.remove(productOptions);
  }
}
