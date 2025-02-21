import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('title_policy_sanctions')
export class TitlePolicySanctionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
