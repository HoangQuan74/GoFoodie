import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EFeeType, EServiceType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { AppFeeEntity } from 'src/database/entities/app-fee.entity';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(FeeEntity)
    private readonly feeRepository: Repository<FeeEntity>,

    @InjectRepository(AppFeeEntity)
    private appFeeRepository: Repository<AppFeeEntity>,
  ) {}

  /**
   * Get shipping fee based on distance
   * @param distance Distance in km
   * @returns Shipping fee
   */
  async getShippingFee(distance: number): Promise<number> {
    const fee = await this.feeRepository.findOne({
      where: { feeType: { value: EFeeType.Shipping }, isActive: true },
      relations: ['appFees'],
    });
    if (!fee) return 0;

    const appFee = fee.appFees.find((appFee) => appFee.appTypeId === EAppType.AppClient);
    if (!appFee) return 0;

    const shippingFeeStr = appFee.value.replace(/\s/g, '');
    const segments = shippingFeeStr.split('|');
    const fees = segments.map((segment) => segment.split(',').map(parseFloat));

    let shippingFee = fees[0][0];

    for (let i = 0; i < fees.length; i++) {
      const [fee, distanceLimit] = fees[i].reverse();
      if (distance < distanceLimit) break;
      shippingFee = fee;
    }

    return shippingFee;
  }

  async getFeeFoodDeliveryByType(appType: EAppType, feeType: EFeeType): Promise<number> {
    const fee = await this.appFeeRepository.findOne({
      where: {
        appTypeId: appType,
        fee: {
          isActive: true,
          serviceTypeId: EServiceType.Food,
          feeType: {
            value: feeType,
          },
        },
      },
    });
    return Number(fee?.value) || 0;
  }

  async getTransactionFeeOfDriver(provinceId: number): Promise<number> {
    const fee = await this.appFeeRepository
      .createQueryBuilder('appFee')
      .innerJoin('appFee.fee', 'fee')
      .innerJoin('fee.feeType', 'feeType')
      .innerJoin('fee.criteria', 'criteria')
      .where('appFee.appTypeId = :appTypeId', { appTypeId: EAppType.AppDriver })
      .andWhere('fee.isActive = :isActive', { isActive: true })
      .andWhere('fee.serviceTypeId = :serviceTypeId', { serviceTypeId: EServiceType.Food })
      .andWhere('feeType.value = :feeTypeValue', { feeTypeValue: EFeeType.Transaction })
      .andWhere(
        `
          EXISTS (
          SELECT 1 FROM unnest(string_to_array(criteria.value, ',')) AS value 
          WHERE value = :provinceId
        )
        `,
        { provinceId: provinceId || -1 },
      )
      .getOne();

    return Number(fee?.value) || 0;
  }
}
