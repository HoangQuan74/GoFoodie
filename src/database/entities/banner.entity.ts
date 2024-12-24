import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EBannerDisplayType, EBannerPosition, EBannerType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { BannerImageEntity } from './banner-image.entity';
import { BannerCriteriaEntity } from './banner-criteria.entity';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @Column()
  name: string;

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

  @OneToMany(() => BannerImageEntity, (image) => image.banner, { cascade: true })
  images: BannerImageEntity[];

  @OneToMany(() => BannerCriteriaEntity, (criteria) => criteria.banner, { cascade: true })
  criteria: BannerCriteriaEntity[];
}
