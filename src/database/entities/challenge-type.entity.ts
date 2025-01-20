import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('challenge_types')
export class ChallengeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
