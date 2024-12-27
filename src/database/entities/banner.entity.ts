import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EBannerDisplayType, EBannerPosition, EBannerType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { BannerImageEntity } from './banner-image.entity';
import { BannerCriteriaEntity } from './banner-criteria.entity';
import { APP_TYPES, BANNER_DISPLAY_TYPES, BANNER_POSITIONS, BANNER_TYPES } from 'src/common/constants';
import { AdminEntity } from './admin.entity';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: 'app_type', type: 'enum', enum: EAppType })
  appType: EAppType;

  @Column()
  type: EBannerType;

  @Column({ name: 'display_type', type: 'enum', enum: EBannerDisplayType })
  displayType: EBannerDisplayType;

  @Column()
  position: EBannerPosition;

  @Column({ name: 'start_date', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => BannerImageEntity, (image) => image.banner, { cascade: true })
  images: BannerImageEntity[];

  @OneToMany(() => BannerCriteriaEntity, (criteria) => criteria.banner, { cascade: true })
  criteria: BannerCriteriaEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  displayImages: number;
  appTypeLabel: string;
  displayTypeLabel: string;
  positionLabel: string;
  typeLabel: string;

  @AfterLoad()
  afterLoad() {
    this.appTypeLabel = APP_TYPES.find((type) => type.value === this.appType)?.label;
    this.displayTypeLabel = BANNER_DISPLAY_TYPES.find((type) => type.value === this.displayType)?.label;
    this.positionLabel = BANNER_POSITIONS.find((position) => position.value === this.position)?.label;
    this.typeLabel = BANNER_TYPES.find((type) => type.value === this.type)?.label;
  }
}
