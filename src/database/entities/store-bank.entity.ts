import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';
import { BaseEntity } from './base.entity';

@Entity('store_banks')
export class StoreBankEntity extends BaseEntity {
  @Column({ name: 'store_id', select: false })
  storeId: number;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'bank_branch' })
  bankBranch: string;

  @Column({ name: 'bank_account_number' })
  bankAccountNumber: string;

  @Column({ name: 'bank_account_name' })
  bankAccountName: string;

  @ManyToOne(() => StoreEntity, (store) => store.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
