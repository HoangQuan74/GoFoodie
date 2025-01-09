import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppTypeEntity } from './app-type.entity';

@Entity('cancel_order_reasons')
export class CancelOrderReasonEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: true })
  status: boolean;

  @ManyToMany(() => AppTypeEntity, (appType) => appType.value)
  @JoinTable({ name: 'cancel_order_reason_app_types' })
  appTypes: AppTypeEntity[];
}
