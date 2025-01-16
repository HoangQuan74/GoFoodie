import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherTypeEntity } from 'src/database/entities/voucher-type.entity';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(VoucherEntity)
    private readonly voucherRepository: Repository<VoucherEntity>,

    @InjectRepository(VoucherTypeEntity)
    private readonly voucherTypeRepository: Repository<VoucherTypeEntity>,
  ) {}

  async save(entity: DeepPartial<VoucherEntity>) {
    return this.voucherRepository.save(entity);
  }

  async find(options?: FindManyOptions<VoucherEntity>) {
    return this.voucherRepository.find(options);
  }

  async findOne(options: FindOneOptions<VoucherEntity>) {
    return this.voucherRepository.findOne(options);
  }

  async findAndCount(options?: FindManyOptions<VoucherEntity>) {
    return this.voucherRepository.findAndCount(options);
  }

  createQueryBuilder(alias: string = 'voucher') {
    return this.voucherRepository.createQueryBuilder(alias);
  }

  async remove(entity: VoucherEntity) {
    return this.voucherRepository.softRemove(entity);
  }

  async findVoucherTypes(options?: FindManyOptions<VoucherTypeEntity>) {
    return this.voucherTypeRepository.find(options);
  }

  async removeProduct(voucher: VoucherEntity, productId: number) {
    return this.createQueryBuilder().relation(VoucherEntity, 'products').of(voucher).remove(productId);
  }

  async removeStore(voucher: VoucherEntity, storeId: number) {
    return this.createQueryBuilder().relation(VoucherEntity, 'stores').of(voucher).remove(storeId);
  }
}
