import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { BannerPositionEntity } from './banner-position.entity';

@Entity('app_types')
export class AppTypeEntity {
  @PrimaryColumn()
  value: string;

  @Column()
  label: string;

  @ManyToMany(() => BannerPositionEntity, (bannerPosition) => bannerPosition.appTypes)
  @JoinTable({
    name: 'app_type_banner_positions',
    joinColumn: { name: 'app_type_id' },
    inverseJoinColumn: { name: 'banner_position_id' },
  })
  bannerPositions: BannerPositionEntity[];
}
