import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('request_types')
export class RequestTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
