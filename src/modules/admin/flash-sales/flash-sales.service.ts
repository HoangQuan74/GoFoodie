import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashSaleEntity } from 'src/database/entities/flash-sale.entity';
import { FlashSaleTimeFrameEntity } from 'src/database/entities/flash-sale-time-frame.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class FlashSalesService {
  constructor(
    @InjectRepository(FlashSaleEntity)
    private readonly flashSaleRepository: Repository<FlashSaleEntity>,

    @InjectRepository(FlashSaleTimeFrameEntity)
    private readonly flashSaleTimeFrameRepository: Repository<FlashSaleTimeFrameEntity>,
  ) {}

  async find(options?: FindManyOptions<FlashSaleEntity>) {
    return this.flashSaleRepository.find(options);
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

  getTimeFrames(options?: FindManyOptions<FlashSaleTimeFrameEntity>) {
    return this.flashSaleTimeFrameRepository.find(options);
  }
}
