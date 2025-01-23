import { ECriteriaType } from 'src/common/enums';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ChallengeEntity } from './challenge.entity';

@Entity('challenge_criteria')
export class ChallengeCriteriaEntity extends BaseEntity {
  @Column({ name: 'challenge_id' })
  challengeId: string;

  @Column()
  type: ECriteriaType;

  @Column({ type: 'simple-array' })
  value: number[];

  @ManyToOne(() => ChallengeEntity, (challenge) => challenge.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'challenge_id' })
  challenge: ChallengeEntity;
}
