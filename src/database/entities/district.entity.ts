import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProvinceEntity } from './province.entity';

@Entity('districts')
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => ProvinceEntity, (province) => province.id)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;
}
