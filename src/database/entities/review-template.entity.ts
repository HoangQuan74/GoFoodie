import { ERoleType } from 'src/common/enums';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('review_templates')
export class ReviewTemplateEntity extends BaseEntity {
  @Column({ enum: ERoleType, type: 'enum' })
  type: ERoleType;

  @Column()
  name: string;

  @Column({ name: 'is_five_star' })
  isFiveStar: boolean;

  @Column({ name: 'is_active' })
  isActive: boolean;
}
