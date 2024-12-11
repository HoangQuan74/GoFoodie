import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EAdminOtpType } from 'src/common/enums';

@Entity('merchant_otps')
export class MerchantOtpEntity extends BaseEntity {
  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column()
  otp: string;

  @Column({ name: 'type', type: 'enum', enum: EAdminOtpType })
  type: EAdminOtpType;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'expired_at' })
  expiredAt: Date;
}
