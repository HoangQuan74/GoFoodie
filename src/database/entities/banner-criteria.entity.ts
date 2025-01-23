import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BannerEntity } from './banner.entity';
import { BaseEntity } from './base.entity';
import { ECriteriaType } from 'src/common/enums';

@Entity('banner_criteria')
@Index(['bannerId', 'type'], { unique: true })
export class BannerCriteriaEntity extends BaseEntity {
  @Column({ name: 'banner_id' })
  bannerId: string;

  @Column()
  type: ECriteriaType;

  @Column({ type: 'simple-array' })
  value: number[];

  @ManyToOne(() => BannerEntity, (banner) => banner.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'banner_id' })
  banner: BannerEntity;
}
