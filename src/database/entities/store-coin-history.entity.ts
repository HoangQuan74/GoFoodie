import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EPaymentMethod, EStoreCoinType, ETransactionStatus } from 'src/common/enums';
import { StoreEntity } from './store.entity';

@Entity('store_coin_histories')
export class StoreCoinHistoryEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'invoice_no', nullable: true })
  invoiceNo: string;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string;

  @Column({ type: 'int8', name: 'amount', default: 0 })
  amount: number;

  @Column({ type: 'int8', name: 'balance', default: 0 })
  balance: number;

  @Column({ type: 'int8', name: 'fee', default: 0 })
  fee?: number;

  @Column({ type: 'int8', name: 'total_paid', default: 0 })
  totalPaid?: number;

  @Column({ name: 'status', type: 'enum', enum: ETransactionStatus, default: ETransactionStatus.Pending })
  status: ETransactionStatus;

  @Column({ name: 'method', type: 'enum', enum: EPaymentMethod, nullable: true })
  method?: EPaymentMethod;

  @Column({ name: 'type', type: 'enum', enum: EStoreCoinType })
  type: EStoreCoinType;

  @Column({ name: 'bank_id', nullable: true })
  bankId?: number;

  @Column({ name: 'bank_account', nullable: true })
  bankAccount?: string;

  @Column({ name: 'bank_account_name', nullable: true })
  bankAccountName?: string;

  @Column({ name: 'description', default: '' })
  description?: string;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
