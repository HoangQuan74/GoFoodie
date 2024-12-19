import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('provinces')
export class ProvinceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'short_name', default: '' })
  shortName: string;
}
