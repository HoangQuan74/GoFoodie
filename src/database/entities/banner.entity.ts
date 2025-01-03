import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EBannerDisplayType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { BannerImageEntity } from './banner-file.entity';
import { BannerCriteriaEntity } from './banner-criteria.entity';
import { APP_TYPES, BANNER_DISPLAY_TYPES } from 'src/common/constants';
import { AdminEntity } from './admin.entity';
import { BannerPositionEntity } from './banner-position.entity';
import { BannerTypeEntity } from './banner-type.entity';
import { BannerChangeTypeEntity } from './banner-change-type.entity';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: 'app_type', type: 'enum', enum: EAppType })
  appType: EAppType;

  @Column()
  type: string;

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

  @Column({ name: 'view_all_link', nullable: true })
  viewAllLink: string;

  @Column({ name: 'change_type', nullable: true })
  changeType: string;

  @OneToMany(() => BannerImageEntity, (image) => image.banner, { cascade: true })
  files: BannerImageEntity[];

  @OneToMany(() => BannerCriteriaEntity, (criteria) => criteria.banner, { cascade: true })
  criteria: BannerCriteriaEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @ManyToOne(() => BannerTypeEntity, (type) => type.value)
  @JoinColumn({ name: 'type' })
  typeEntity: BannerTypeEntity;

  @ManyToOne(() => BannerPositionEntity, (position) => position.value)
  @JoinColumn({ name: 'position' })
  positionEntity: BannerPositionEntity;

  @ManyToOne(() => BannerChangeTypeEntity, (changeType) => changeType.value)
  @JoinColumn({ name: 'change_type' })
  changeTypeEntity: BannerChangeTypeEntity;

  countActiveBanner: number;
  appTypeLabel: string;
  displayTypeLabel: string;
  positionLabel: string;
  typeLabel: string;

  @AfterLoad()
  afterLoad() {
    this.appTypeLabel = APP_TYPES.find((type) => type.value === this.appType)?.label;
    this.displayTypeLabel = BANNER_DISPLAY_TYPES.find((type) => type.value === this.displayType)?.label;
    this.positionLabel = this.positionEntity?.label;
    this.typeLabel = this.typeEntity?.label;
  }
}
