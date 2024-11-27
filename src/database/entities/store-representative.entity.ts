import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { FileEntity } from './file.entity';
import { EStoreRepresentativeType } from 'src/common/enums';

@Entity('store_representatives')
export class StoreRepresentativeEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EStoreRepresentativeType })
  type: EStoreRepresentativeType;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'order_phone', nullable: true })
  orderPhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'tax_code' })
  taxCode: string;

  @Column({ name: 'personal_tax_code', nullable: true })
  personalTaxCode: string;

  @Column({ name: 'identity_card', nullable: true })
  identityCard: string;

  @Column({ name: 'identity_card_date', nullable: true })
  identityCardDate: string;

  @Column({ name: 'identity_card_place', nullable: true })
  identityCardPlace: string;

  @Column({ name: 'identity_card_front_image_id', nullable: true, type: 'uuid' })
  identityCardFrontImageId: string;

  @Column({ name: 'identity_card_back_image_id', nullable: true, type: 'uuid' })
  identityCardBackImageId: string;

  @Column({ name: 'business_license_image_id', nullable: true, type: 'uuid' })
  businessLicenseImageId: string;

  @Column({ name: 'tax_license_image_id', type: 'uuid' })
  taxLicenseImageId: string;

  @Column({ name: 'related_image_id', nullable: true, type: 'uuid' })
  relatedImageId: string;

  @Column({ name: 'store_id', select: false })
  storeId: number;

  @ManyToOne(() => StoreEntity, (store) => store.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'identity_card_front_image_id' })
  identityCardFrontImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'identity_card_back_image_id' })
  identityCardBackImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'business_license_image_id' })
  businessLicenseImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'tax_license_image_id' })
  taxLicenseImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'related_image_id' })
  relatedImage: FileEntity;
}
