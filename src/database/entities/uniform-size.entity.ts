import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('uniform_sizes')
export class DriverUniformSizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;
}
