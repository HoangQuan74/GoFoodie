import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';
import { BaseEntity } from './base.entity';
import { BankEntity } from './bank.entity';
import { BankBranchEntity } from './bank-branch.entity';

@Entity('store_banks')
export class StoreBankEntity extends BaseEntity {
  @Column({ name: 'store_id', select: false })
  storeId: number;

  @Column({ name: 'bank_id' })
  bankId: number;

  @Column({ name: 'bank_branch_id' })
  bankBranchId: number;

  @Column({ name: 'bank_account_number' })
  bankAccountNumber: string;

  @Column({ name: 'bank_account_name' })
  bankAccountName: string;

  @ManyToOne(() => StoreEntity, (store) => store.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => BankEntity, (bank) => bank.id, { nullable: false })
  @JoinColumn({ name: 'bank_id' })
  bank: BankEntity;

  @ManyToOne(() => BankBranchEntity, (bankBranch) => bankBranch.id, { nullable: false })
  @JoinColumn({ name: 'bank_branch_id' })
  bankBranch: BankBranchEntity;
}
