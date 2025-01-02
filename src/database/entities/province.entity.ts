import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ServiceTypeEntity } from './service-type.entity';

@Entity('provinces')
export class ProvinceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'short_name', default: '' })
  shortName: string;

  @ManyToMany(() => ServiceTypeEntity, (serviceType) => serviceType.provinces)
  serviceTypes: ServiceTypeEntity[];
}
