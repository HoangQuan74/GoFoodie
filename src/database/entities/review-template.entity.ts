import { EUserType } from 'src/common/enums';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReviewCriteriaEntity } from './review-criteria.entity';

@Entity('review_templates')
export class ReviewTemplateEntity extends BaseEntity {
  @Column({ enum: EUserType, type: 'enum' })
  type: EUserType;

  @Column()
  name: string;

  @Column({ name: 'criteria_id', nullable: true })
  criteriaId: number;

  @Column({ name: 'is_five_star' })
  isFiveStar: boolean;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => ReviewCriteriaEntity, (criteria) => criteria.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'criteria_id' })
  criteria: ReviewCriteriaEntity;
}
