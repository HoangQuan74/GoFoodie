import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EPaymentMethod, ETransactionStatus, ETransactionType } from 'src/common/enums';
import { StoreEntity } from './store.entity';
import { BankEntity } from './bank.entity';

@Entity('store_transaction_histories')
export class StoreTransactionHistoryEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ type: 'int8', name: 'amount' })
  amount: number;

  @Column({ type: 'int8', name: 'balance' })
  balance: number;

  @Column({ name: 'status', type: 'enum', enum: ETransactionStatus, default: ETransactionStatus.Pending })
  status: ETransactionStatus;

  @Column({ name: 'type', type: 'enum', enum: ETransactionType })
  type: ETransactionType;

  @Column({ name: 'invoice_no' })
  invoiceNo: string;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: number;

  @Column({ name: 'bank_id', nullable: true })
  bankId: number;

  @Column({ name: 'bank_account', nullable: true })
  bankAccount: string;

  @Column({ name: 'bank_account_name', nullable: true })
  bankAccountName: string;

  @Column({ name: 'method', type: 'enum', enum: EPaymentMethod })
  method: EPaymentMethod;

  @Column({ name: 'description', default: '' })
  description: string;

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => BankEntity, (bank) => bank.id)
  @JoinColumn({ name: 'bank_id' })
  bank: BankEntity;
}
