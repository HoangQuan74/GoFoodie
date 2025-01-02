import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ProvinceEntity } from './province.entity';

@Entity('service_types')
export class ServiceTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  code: string;

  @ManyToMany(() => ProvinceEntity, (province) => province.serviceTypes)
  @JoinTable({
    name: 'service_type_provinces',
    joinColumn: { name: 'service_type_id' },
    inverseJoinColumn: { name: 'province_id' },
  })
  provinces: ProvinceEntity[];
}
