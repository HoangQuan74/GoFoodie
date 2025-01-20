import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('challenge_types')
export class ChallengeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
