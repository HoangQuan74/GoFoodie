import { EMerchantRole } from './../../common/enums/merchant.enum';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EMerchantStatus } from 'src/common/enums';
import { StoreEntity } from './store.entity';
import { FileEntity } from './file.entity';

@Entity('merchants')
export class MerchantEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, name: 'avatar_id' })
  avatarId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'store_id', nullable: true })
  storeId: number;

  @Column({ name: 'device_token', nullable: true })
  deviceToken: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ name: 'status', type: 'enum', enum: EMerchantStatus, default: EMerchantStatus.Active })
  status: EMerchantStatus;

  @Column({ name: 'role', type: 'enum', enum: EMerchantRole, default: EMerchantRole.Owner })
  role: EMerchantRole;

  @OneToMany(() => StoreEntity, (store) => store.merchant, { cascade: false })
  stores: StoreEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'avatar_id' })
  avatar: FileEntity;
}
