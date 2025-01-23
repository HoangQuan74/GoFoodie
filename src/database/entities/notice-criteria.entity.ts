import { AfterLoad, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { NoticeEntity } from './notice.entity';
import { BaseEntity } from './base.entity';
import { ECriteriaType } from 'src/common/enums';
import { CRITERIA_TYPES } from 'src/common/constants';

@Entity('notice_criteria')
@Index(['noticeId', 'type'], { unique: true })
export class NoticeCriteriaEntity extends BaseEntity {
  @Column({ name: 'notice_id' })
  noticeId: string;

  @Column()
  type: ECriteriaType;

  @Column({ type: 'simple-array' })
  value: number[];

  @ManyToOne(() => NoticeEntity, (notice) => notice.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'notice_id' })
  notice: NoticeEntity;

  typeLabel: string;

  @AfterLoad()
  setComputed() {
    this.typeLabel = CRITERIA_TYPES.find((item) => item.value === this.type)?.label;
  }
}
