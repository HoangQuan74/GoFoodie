import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('voucher_types')
export class VoucherTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
