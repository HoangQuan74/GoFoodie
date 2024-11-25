import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service_groups')
export class ServiceGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
