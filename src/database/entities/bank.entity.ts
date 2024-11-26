import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankBranchEntity } from './bank-branch.entity';

@Entity('banks')
export class BankEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: 'short_name' })
  sortName: string;

  @Column({ name: 'swift_code', nullable: true })
  swiftCode: string;

  @Column({ name: 'logo_url' })
  logoUrl: string;

  @OneToMany(() => BankBranchEntity, (branch) => branch.bank)
  branches: BankBranchEntity[];
}
