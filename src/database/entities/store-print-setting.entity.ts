import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { EStorePrintConfirmType, EStorePrintType } from 'src/common/enums';

@Entity('store_print_settings')
export class StorePrintSettingEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'auto_print', default: false })
  autoPrint: boolean;

  @Column({ name: 'print_type', type: 'enum', enum: EStorePrintType })
  printType: EStorePrintType;

  @Column({ name: 'confirm_types', type: 'enum', enum: EStorePrintConfirmType, array: true })
  confirmTypes: EStorePrintConfirmType[];

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
