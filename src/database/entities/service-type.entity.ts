import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service_types')
export class ServiceTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
