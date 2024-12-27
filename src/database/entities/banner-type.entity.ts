import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { BannerPositionEntity } from './banner-position.entity';

@Entity('banner_types')
export class BannerTypeEntity {
  @PrimaryColumn()
  value: string;

  @Column()
  label: string;

  @ManyToMany(() => BannerPositionEntity, (bannerPosition) => bannerPosition.bannerTypes)
  @JoinTable({
    name: 'banner_type_banner_positions',
    joinColumn: { name: 'banner_type_id' },
    inverseJoinColumn: { name: 'banner_position_id' },
  })
  bannerPositions: BannerPositionEntity[];
}
