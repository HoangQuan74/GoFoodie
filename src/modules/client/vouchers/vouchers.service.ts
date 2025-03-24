import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { Brackets, Repository } from 'typeorm';
import { CartsService } from '../carts/carts.service';
import { EVoucherType } from 'src/common/enums/voucher.enum';
import { EXCEPTIONS } from 'src/common/constants';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(VoucherEntity)
    private voucherRepository: Repository<VoucherEntity>,

    private readonly cartsService: CartsService,
  ) {}

  createQueryBuilder(alias: string) {
    return this.voucherRepository.createQueryBuilder(alias);
  }

  async checkVoucher(voucherCode: string, cartId: number) {
    const { total: productPrice, storeId, productIds } = await this.cartsService.getCartValue(cartId);
    if (productIds.length === 0) return null;

    const voucher = await this.voucherRepository
      .createQueryBuilder('voucher')
      .addSelect(['product.id', 'store.id'])
      .leftJoin('voucher.products', 'product', 'product.id IN (:...productIds)', { productIds })
      .leftJoin('voucher.stores', 'store', 'store.id = :storeId', { storeId })
      .where('voucher.code = :code', { code: voucherCode })
      // .andWhere('voucher.startTime <= NOW()')
      // .andWhere('voucher.endTime >= NOW()')
      .andWhere('voucher.isActive = true')
      .getOne();

    if (!voucher) throw new NotFoundException();
    const cause = voucher.id;
    if (voucher.startTime > new Date()) throw new BadRequestException(EXCEPTIONS.VOUCHER_NOT_STARTED, { cause });
    if (voucher.endTime < new Date()) throw new BadRequestException(EXCEPTIONS.VOUCHER_EXPIRED, { cause });

    if (voucher.minOrderValue > productPrice) {
      throw new BadRequestException(EXCEPTIONS.VOUCHER_MIN_ORDER_VALUE, { cause });
    }

    if (voucher.typeId === EVoucherType.Store && voucher.stores.length === 0 && !voucher.isAllItems) {
      throw new BadRequestException(EXCEPTIONS.VOUCHER_NOT_APPLY, { cause });
    }
    if (voucher.typeId === EVoucherType.Product && voucher.products.length === 0 && !voucher.isAllItems) {
      throw new BadRequestException(EXCEPTIONS.VOUCHER_NOT_APPLY, { cause });
    }

    return voucher;
  }
}
