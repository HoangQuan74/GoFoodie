import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashSaleEntity } from 'src/database/entities/flash-sale.entity';
import { FlashSaleTimeFrameEntity } from 'src/database/entities/flash-sale-time-frame.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FlashSaleProductEntity } from 'src/database/entities/flash-sale-product.entity';

@Injectable()
export class FlashSalesService {
  constructor(
    @InjectRepository(FlashSaleEntity)
    private readonly flashSaleRepository: Repository<FlashSaleEntity>,

    @InjectRepository(FlashSaleTimeFrameEntity)
    private readonly flashSaleTimeFrameRepository: Repository<FlashSaleTimeFrameEntity>,

    @InjectRepository(FlashSaleProductEntity)
    private readonly flashSaleProductRepository: Repository<FlashSaleProductEntity>,
  ) {}

  async find(options?: FindManyOptions<FlashSaleEntity>) {
    return this.flashSaleRepository.find(options);
  }

  async findAndCount(options?: FindManyOptions<FlashSaleEntity>) {
    return this.flashSaleRepository.findAndCount(options);
  }

  async save(entity: DeepPartial<FlashSaleEntity>) {
    return this.flashSaleRepository.save(entity);
  }

  async findOne(options?: FindOneOptions<FlashSaleEntity>) {
    return this.flashSaleRepository.findOne(options);
  }

  async remove(entity: FlashSaleEntity) {
    return this.flashSaleRepository.softRemove(entity);
  }

  async getTimeFrames(options?: FindManyOptions<FlashSaleTimeFrameEntity>) {
    return this.flashSaleTimeFrameRepository.find(options);
  }

  async findAndCountProducts(options?: FindManyOptions<FlashSaleProductEntity>) {
    return this.flashSaleProductRepository.findAndCount(options);
  }

  async findProducts(options?: FindManyOptions<FlashSaleProductEntity>) {
    return this.flashSaleProductRepository.find(options);
  }

  async saveProducts(entities: Partial<FlashSaleProductEntity>[]) {
    return this.flashSaleProductRepository.save(entities);
  }

  async removeProducts(entities: FlashSaleProductEntity[]) {
    return this.flashSaleProductRepository.softRemove(entities);
  }
}
