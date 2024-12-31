import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EBannerDisplayType, EBannerType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { BannerImageEntity } from './banner-file.entity';
import { BannerCriteriaEntity } from './banner-criteria.entity';
import { APP_TYPES, BANNER_DISPLAY_TYPES, BANNER_TYPES } from 'src/common/constants';
import { AdminEntity } from './admin.entity';
import { BannerPositionEntity } from './banner-position.entity';

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
  position: string;

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
  files: BannerImageEntity[];

  @OneToMany(() => BannerCriteriaEntity, (criteria) => criteria.banner, { cascade: true })
  criteria: BannerCriteriaEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  countActiveBanner: number;
  appTypeLabel: string;
  displayTypeLabel: string;
  positionLabel: string;
  typeLabel: string;

  @ManyToOne(() => BannerPositionEntity, (position) => position.value)
  @JoinColumn({ name: 'position' })
  positionEntity: BannerPositionEntity;

  @AfterLoad()
  afterLoad() {
    this.appTypeLabel = APP_TYPES.find((type) => type.value === this.appType)?.label;
    this.displayTypeLabel = BANNER_DISPLAY_TYPES.find((type) => type.value === this.displayType)?.label;
    this.positionLabel = this.positionEntity?.label;
    this.typeLabel = BANNER_TYPES.find((type) => type.value === this.type)?.label;
  }
}
