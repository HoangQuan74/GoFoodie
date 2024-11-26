import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MerchantEntity } from './merchant.entity';
import { EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { StoreRepresentativeEntity } from './store-representative.entity';
import { StoreWorkingTimeEntity } from './store-working-time.entity';
import { StoreBankEntity } from './store-bank.entity';
import { ServiceGroupEntity } from './service-group.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({ name: 'store_code' })
  storeCode: string;

  @Column()
  name: string;

  @Column({ name: 'special_dish', nullable: true })
  specialDish: string;

  @Column({ name: 'street_name', nullable: true })
  streetName: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'service_group', nullable: true })
  serviceGroupId: number;

  @Column({ name: 'business_area', nullable: true })
  businessAreaId: number;

  @Column({ name: 'province_id' })
  provinceId: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'ward_id' })
  wardId: number;

  @Column()
  address: string;

  @Column({ name: 'status', type: 'enum', enum: EStoreStatus, default: EStoreStatus.Active })
  status: string;

  @Column({ name: 'approval_status', type: 'enum', enum: EStoreApprovalStatus, default: EStoreApprovalStatus.Pending })
  approvalStatus: string;

  @ManyToOne(() => ServiceGroupEntity, (serviceGroup) => serviceGroup.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_group_id' })
  serviceGroup: ServiceGroupEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @OneToOne(() => StoreRepresentativeEntity, (storeRepresentative) => storeRepresentative.store, { cascade: true })
  representative: StoreRepresentativeEntity;

  @OneToMany(() => StoreWorkingTimeEntity, (workingTime) => workingTime.store, { cascade: true })
  workingTimes: StoreWorkingTimeEntity[];

  @OneToMany(() => StoreBankEntity, (bank) => bank.store, { cascade: true })
  banks: StoreBankEntity[];
}
