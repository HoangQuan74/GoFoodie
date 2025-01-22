import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EFeeType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(FeeEntity)
    private readonly feeRepository: Repository<FeeEntity>,
  ) {}

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
}
