import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { FeeEntity } from './fee.entity';
import { AppTypeEntity } from './app-type.entity';
import { EFeeType } from 'src/common/enums';

@Entity('fee_types')
export class FeeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  value: EFeeType;

  @OneToMany(() => FeeEntity, (fee) => fee.feeType)
  fees: FeeEntity[];

  @ManyToMany(() => AppTypeEntity, (appType) => appType.feeTypes)
  appTypes: AppTypeEntity[];
}
