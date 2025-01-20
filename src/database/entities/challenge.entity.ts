import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChallengeTypeEntity } from './challenge-type.entity';
import { ServiceTypeEntity } from './service-type.entity';
import { BannerPositionEntity } from './banner-position.entity';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { ChallengeCriteriaEntity } from './challenge-criteria.entity';

@Entity('challenges')
export class ChallengeEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'image_id' })
  imageId: string;

  @Column()
  code: string;

  @Column({ comment: 'Duration in days' })
  duration: number;

  @Column('text')
  description: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: `is_limited_budget` })
  isLimitedBudget: boolean;

  @Column()
  budget: number;

  @Column()
  reward: number;

  @Column({ name: 'position_value' })
  positionValue: string;

  @Column({ name: 'type_id' })
  typeId: number;

  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @ManyToOne(() => ChallengeTypeEntity, (type) => type.id)
  @JoinColumn({ name: 'type_id' })
  type: ChallengeTypeEntity;

  @ManyToOne(() => ServiceTypeEntity, (type) => type.id)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;

  @ManyToOne(() => BannerPositionEntity, (position) => position.value)
  @JoinColumn({ name: 'position_value' })
  position: BannerPositionEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @OneToMany(() => ChallengeCriteriaEntity, (criteria) => criteria.challenge)
  criteria: ChallengeCriteriaEntity[];
}
