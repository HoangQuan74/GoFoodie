import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EMerchantStatus } from 'src/common/enums';

@Entity('merchants')
export class MerchantEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'status', type: 'enum', enum: EMerchantStatus, default: EMerchantStatus.Active })
  status: EMerchantStatus;
}
