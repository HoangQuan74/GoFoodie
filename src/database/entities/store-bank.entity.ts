import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';
import { BaseEntity } from './base.entity';
import { BankEntity } from './bank.entity';
import { BankBranchEntity } from './bank-branch.entity';

@Entity('store_banks')
export class StoreBankEntity extends BaseEntity {
  @Column({ name: 'store_id', select: false })
  storeId: number;

  @Column({ name: 'bank_id', nullable: true })
  bankId: number;

  @Column({ name: 'bank_branch_id', nullable: true })
  bankBranchId: number;

  @Column({ name: 'bank_account_number', nullable: true })
  bankAccountNumber: string;

  @Column({ name: 'bank_account_name', nullable: true })
  bankAccountName: string;

  @ManyToOne(() => StoreEntity, (store) => store.banks, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => BankEntity, (bank) => bank.id)
  @JoinColumn({ name: 'bank_id' })
  bank: BankEntity;

  @ManyToOne(() => BankBranchEntity, (bankBranch) => bankBranch.id)
  @JoinColumn({ name: 'bank_branch_id' })
  bankBranch: BankBranchEntity;
}
