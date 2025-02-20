import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('title_policy_criteria')
export class TitlePolicyCriteriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
