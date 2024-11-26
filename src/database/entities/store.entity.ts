import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MerchantEntity } from './merchant.entity';
import { EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { StoreRepresentativeEntity } from './store-representative.entity';
import { StoreWorkingTimeEntity } from './store-working-time.entity';
import { StoreBankEntity } from './store-bank.entity';
import { ServiceGroupEntity } from './service-group.entity';
import { ProvinceEntity } from './province.entity';
import { DistrictEntity } from './district.entity';
import { WardEntity } from './ward.entity';
import { ServiceTypeEntity } from './service-type.entity';
import { AdminEntity } from './admin.entity';
import { FileEntity } from './file.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({ name: 'merchant_id', select: false })
  merchantId: number;

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

  @Column({ name: 'service_type_id', nullable: true })
  serviceTypeId: number;

  @Column({ name: 'service_group_id', nullable: true })
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

  @Column({ name: 'approved_by_id', nullable: true, select: false })
  approvedById: number;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ name: 'created_by_id', nullable: true, select: false })
  createdById: number;

  @Column({ name: 'store_avatar_id' })
  storeAvatarId: string;

  @Column({ name: 'store_cover_id' })
  storeCoverId: string;

  @Column({ name: 'store_front_id' })
  storeFrontId: string;

  @Column({ name: 'store_menu_id' })
  storeMenuId: string;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @ManyToOne(() => AdminEntity, (admin) => admin.id, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @ManyToOne(() => ServiceGroupEntity, (serviceGroup) => serviceGroup.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_group_id' })
  serviceGroup: ServiceGroupEntity;

  @ManyToOne(() => ServiceTypeEntity, (serviceType) => serviceType.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @OneToOne(() => StoreRepresentativeEntity, (storeRepresentative) => storeRepresentative.store, { cascade: true })
  representative: StoreRepresentativeEntity;

  @OneToMany(() => StoreWorkingTimeEntity, (workingTime) => workingTime.store, { cascade: true })
  workingTimes: StoreWorkingTimeEntity[];

  @OneToMany(() => StoreBankEntity, (bank) => bank.store, { cascade: true })
  banks: StoreBankEntity[];

  @ManyToOne(() => ProvinceEntity, (province) => province.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_area' })
  businessArea: ProvinceEntity;

  @ManyToOne(() => ProvinceEntity, (province) => province.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @ManyToOne(() => DistrictEntity, (district) => district.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;

  @ManyToOne(() => WardEntity, (ward) => ward.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ward_id' })
  ward: WardEntity;

  productCount: number = 0;
}
