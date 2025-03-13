import { Injectable } from '@nestjs/common';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EFeeType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(FeeEntity)
    private feeRepository: Repository<FeeEntity>,
  ) {}

  async getTransactionFee(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .innerJoin('fee.feeType', 'feeType', 'feeType.value = :value', { value: EFeeType.Transaction })
      .innerJoinAndSelect('fee.appFees', 'appFee', 'appFee.appTypeId = :appTypeId', { appTypeId: EAppType.AppMerchant })
      .where('fee.isActive = :isActive', { isActive: true })
      .getOne();

    return fee?.appFees ? Number(fee.appFees[0].value) : 0;
  }
}
