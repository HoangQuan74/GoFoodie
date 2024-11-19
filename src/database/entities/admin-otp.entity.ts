import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EAdminOtpType } from 'src/common/enums';

@Entity('admin_otps')
export class AdminOtpEntity extends BaseEntity {
  @Column({ name: 'admin_id' })
  adminId: number;

  @Column()
  otp: string;

  @Column({ name: 'type', type: 'enum', enum: EAdminOtpType })
  type: EAdminOtpType;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'expired_at' })
  expiredAt: Date;
}
