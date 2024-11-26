import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BankEntity } from './bank.entity';

@Entity('bank_branches')
export class BankBranchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'bank_id' })
  bankId: number;

  @ManyToOne(() => BankEntity, (bank) => bank.branches)
  @JoinColumn({ name: 'bank_id' })
  bank: BankEntity;
}
