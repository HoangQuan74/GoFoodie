import { ECriteriaType } from 'src/common/enums';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FeeEntity } from './fee.entity';

@Entity('fee_criteria')
export class FeeCriteriaEntity extends BaseEntity {
  @Column({ name: 'fee_id' })
  feeId: string;

  @Column()
  type: ECriteriaType;

  @Column({ type: 'simple-array' })
  value: number[];

  @ManyToOne(() => FeeEntity, (fee) => fee.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'fee_id' })
  fee: FeeEntity;
}
