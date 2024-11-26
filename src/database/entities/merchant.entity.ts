import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EMerchantStatus } from 'src/common/enums';
import { StoreEntity } from './store.entity';

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

  @OneToMany(() => StoreEntity, (store) => store.merchant, { cascade: true })
  stores: StoreEntity[];

  storeNumber: number = 0;
  approvedStoreNumber: number = 0;
  unapprovedStoreNumber: number = 0;
}
