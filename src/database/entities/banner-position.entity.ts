import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { AppTypeEntity } from './app-type.entity';
import { BannerTypeEntity } from './banner-type.entity';

@Entity('banner_positions')
export class BannerPositionEntity {
  @PrimaryColumn()
  value: string;

  @Column()
  label: string;

  @ManyToMany(() => AppTypeEntity, (appType) => appType.bannerPositions)
  appTypes: AppTypeEntity[];

  @ManyToMany(() => BannerTypeEntity, (bannerType) => bannerType.bannerPositions)
  bannerTypes: BannerTypeEntity[];
}
