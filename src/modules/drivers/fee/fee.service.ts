import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { Repository } from 'typeorm';
import { EFeeType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import * as _ from 'lodash';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(FeeEntity)
    private feeRepository: Repository<FeeEntity>,
  ) {
    this.getDepositFee();
  }

  async getTransactionFee(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .innerJoin('fee.feeType', 'feeType', 'feeType.value = :value', { value: EFeeType.Transaction })
      .innerJoinAndSelect('fee.appFees', 'appFee', 'appFee.appTypeId = :appTypeId', { appTypeId: EAppType.AppDriver })
      .where('fee.isActive = :isActive', { isActive: true })
      .getOne();

    return fee?.appFees ? Number(fee.appFees[0].value) : 0;
  }

  async getDepositFee() {
    const fees = await this.feeRepository
      .createQueryBuilder('fee')
      .innerJoinAndSelect('fee.serviceType', 'serviceType')
      .innerJoin('fee.feeType', 'feeType', 'feeType.value = :value', { value: EFeeType.DepositFee })
      .innerJoinAndSelect('fee.appFees', 'appFee', 'appFee.appTypeId = :appTypeId', { appTypeId: EAppType.AppDriver })
      .where('fee.isActive = :isActive', { isActive: true })
      .getMany();

    const feeGroupByServiceType = _.groupBy(fees, 'serviceTypeId');

    return _.map(feeGroupByServiceType, (fees, serviceTypeId) => {
      const serviceType = fees[0].serviceType.name;
      const feeValue = fees[0].appFees[0].value;
      return {
        serviceTypeId,
        serviceType,
        fee: Number(feeValue),
      };
    });
  }
}
