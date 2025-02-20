import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TitleEntity } from './title.entity';
import { ETitlePolicyType, ETitlePolicyFrequency } from 'src/common/enums';
import { TitlePolicyCriteriaEntity } from './title-policy-criteria.entity';
import { TitlePolicySanctionEntity } from './title-policy-sanction.entity';

@Entity('title_policies')
export class TitlePolicyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'criteria_id' })
  criteriaId: number;

  @Column({ name: 'sanction_id' })
  sanctionId: number;

  @Column()
  condition: string;

  @Column()
  point: number;

  @Column()
  type: ETitlePolicyType;

  @Column()
  frequency: ETitlePolicyFrequency;

  @ManyToOne(() => TitlePolicyEntity, (policy) => policy.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'title_id' })
  title: TitleEntity;

  @ManyToOne(() => TitlePolicyCriteriaEntity, (criteria) => criteria.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'criteria_id' })
  criteria: TitlePolicyCriteriaEntity;

  @ManyToOne(() => TitlePolicySanctionEntity, (sanction) => sanction.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sanction_id' })
  sanction: TitlePolicySanctionEntity;
}
