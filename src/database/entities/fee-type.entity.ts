import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { FeeEntity } from './fee.entity';
import { AppTypeEntity } from './app-type.entity';

@Entity('fee_types')
export class FeeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => FeeEntity, (fee) => fee.feeType)
  fees: FeeEntity[];

  @ManyToMany(() => AppTypeEntity, (appType) => appType.feeTypes)
  appTypes: AppTypeEntity[];
}
