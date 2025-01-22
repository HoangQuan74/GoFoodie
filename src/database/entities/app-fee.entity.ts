import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AppTypeEntity } from './app-type.entity';
import { FeeEntity } from './fee.entity';
import { EAppType } from 'src/common/enums/config.enum';

@Entity('app_fees')
export class AppFeeEntity {
  @PrimaryColumn({ name: 'app_type_id' })
  appTypeId: EAppType;

  @PrimaryColumn({ name: 'fee_id' })
  feeId: number;

  @Column()
  value: string;

  @ManyToOne(() => AppTypeEntity, (appType) => appType.value)
  @JoinColumn({ name: 'app_type_id' })
  appType: AppTypeEntity;

  @ManyToOne(() => FeeEntity, (fee) => fee.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'fee_id' })
  fee: FeeEntity;
}
