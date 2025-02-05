import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('review_criteria')
export class ReviewCriteriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
