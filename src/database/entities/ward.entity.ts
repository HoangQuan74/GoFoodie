import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity('wards')
export class WardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'district_id' })
  districtId: number;

  @ManyToOne(() => DistrictEntity, (district) => district.id)
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;
}
