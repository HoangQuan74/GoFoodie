import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('relationships')
export class RelationshipEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;
}
