import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BannerEntity } from './banner.entity';

@Entity('banner_change_types')
export class BannerChangeTypeEntity {
  @PrimaryColumn()
  value: string;

  @Column()
  label: string;

  @OneToMany(() => BannerEntity, (banner) => banner.changeType)
  banners: BannerEntity[];
}
