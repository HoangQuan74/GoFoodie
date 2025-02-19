//option.entity.ts
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OptionGroupEntity } from './option-group.entity';
import { EOptionStatus } from 'src/common/enums';

@Entity('options')
export class OptionEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column({ type: 'enum', enum: EOptionStatus, default: EOptionStatus.Active })
  status: EOptionStatus;

  @Column({ name: 'option_group_id' })
  optionGroupId: number;

  @ManyToOne(() => OptionGroupEntity, (optionGroup) => optionGroup.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_group_id' })
  optionGroup: OptionGroupEntity;
}
