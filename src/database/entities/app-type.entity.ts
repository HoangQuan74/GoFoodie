import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { BannerPositionEntity } from './banner-position.entity';
import { FeeTypeEntity } from './fee-type.entity';

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

  @ManyToMany(() => FeeTypeEntity, (feeType) => feeType.appTypes)
  @JoinTable({
    name: 'app_type_fee_types',
    joinColumn: { name: 'app_type_id' },
    inverseJoinColumn: { name: 'fee_type_id' },
  })
  feeTypes: FeeTypeEntity[];
}
