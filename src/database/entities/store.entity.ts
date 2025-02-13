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
import { StoreSpecialWorkingTimeEntity } from './store-special-working-time.entity';
import { ProductEntity } from './product.entity';
import { StoreLikeEntity } from './store-like.entity';
import { OrderEntity } from './order.entity';
import { StorePreparationTimeEntity } from './store-preparation-time.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'store_code', nullable: true })
  storeCode: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'special_dish', nullable: true })
  specialDish: string;

  @Column({ name: 'street_name', nullable: true })
  streetName: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'service_type_id', nullable: true })
  serviceTypeId: number;

  @Column({ name: 'is_alcohol', default: false })
  isAlcohol: boolean;

  @Column({ name: 'service_group_id', nullable: true })
  serviceGroupId: number;

  @Column({ name: 'business_area', nullable: true })
  businessAreaId: number;

  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'is_pause', default: false })
  isPause: boolean;

  @Column({ name: 'is_special_working_time', default: false })
  isSpecialWorkingTime: boolean;

  @Column({ name: 'ward_id', nullable: true })
  wardId: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'float' })
  latitude: number;

  @Column({ nullable: true, type: 'float' })
  longitude: number;

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

  @Column({ name: 'store_avatar_id', type: 'uuid', nullable: true })
  storeAvatarId: string;

  @Column({ name: 'store_cover_id', type: 'uuid', nullable: true })
  storeCoverId: string;

  @Column({ name: 'store_front_id', type: 'uuid', nullable: true })
  storeFrontId: string;

  @Column({ name: 'store_menu_id', type: 'uuid', nullable: true })
  storeMenuId: string;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'store_avatar_id' })
  storeAvatar: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'store_cover_id' })
  storeCover: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'store_front_id' })
  storeFront: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'store_menu_id' })
  storeMenu: FileEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: AdminEntity;

  @Column({ name: 'parking_fee', nullable: true })
  parkingFee: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @Column({ name: 'reject_reason', nullable: true })
  rejectReason: string;

  @Column({ name: 'preparation_time', type: 'int', default: 20 })
  preparationTime: number;

  @Column({ name: 'auto_accept_order', default: false })
  autoAcceptOrder: boolean;

  @ManyToOne(() => ServiceGroupEntity, (serviceGroup) => serviceGroup.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_group_id' })
  serviceGroup: ServiceGroupEntity;

  @ManyToOne(() => ServiceTypeEntity, (serviceType) => serviceType.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.stores)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @OneToOne(() => StoreRepresentativeEntity, (storeRepresentative) => storeRepresentative.store, { cascade: true })
  representative: StoreRepresentativeEntity;

  @OneToMany(() => StoreWorkingTimeEntity, (workingTime) => workingTime.store, { cascade: true })
  workingTimes: StoreWorkingTimeEntity[];

  @OneToMany(() => StoreBankEntity, (bank) => bank.store, { cascade: true })
  banks: StoreBankEntity[];

  @ManyToOne(() => ProvinceEntity, (province) => province.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'business_area' })
  businessArea: ProvinceEntity;

  @ManyToOne(() => ProvinceEntity, (province) => province.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @ManyToOne(() => DistrictEntity, (district) => district.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;

  @ManyToOne(() => WardEntity, (ward) => ward.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ward_id' })
  ward: WardEntity;

  @OneToMany(() => MerchantEntity, (merchant) => merchant.store, { cascade: true })
  staffs: MerchantEntity[];

  @OneToMany(() => StoreSpecialWorkingTimeEntity, (specialWorkingTime) => specialWorkingTime.store, { cascade: true })
  specialWorkingTimes: StoreSpecialWorkingTimeEntity[];

  @OneToMany(() => ProductEntity, (product) => product.store)
  products: ProductEntity[];

  @OneToMany(() => StoreLikeEntity, (like) => like.store)
  likes: StoreLikeEntity[];

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];

  @OneToMany(() => StorePreparationTimeEntity, (preparationTime) => preparationTime.store)
  preparationTimes: StorePreparationTimeEntity[];

  productCount: number;
}
