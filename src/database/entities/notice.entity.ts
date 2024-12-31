import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EAppType } from 'src/common/enums/config.enum';
import { NoticeTypeEntity } from './notice-type.entity';
import { ENoticeSendType } from 'src/common/enums/notice.enum';
import { AppTypeEntity } from './app-type.entity';
import { NoticeCriteriaEntity } from './notice-criteria.entity';
import { AdminEntity } from './admin.entity';

@Entity('notices')
export class NoticeEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'notice_type_id' })
  noticeTypeId: number;

  @Column({ name: 'send_type', type: 'enum', enum: ENoticeSendType })
  sendType: ENoticeSendType;

  @Column({ name: 'app_type', type: 'enum', enum: EAppType })
  appType: EAppType;

  @Column({ name: 'send_now' })
  sendNow: boolean;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @ManyToOne(() => NoticeTypeEntity, (type) => type.notices)
  @JoinColumn({ name: 'notice_type_id' })
  type: NoticeTypeEntity;

  @ManyToOne(() => AppTypeEntity, (appType) => appType.value)
  @JoinColumn({ name: 'app_type' })
  app: AppTypeEntity;

  @OneToMany(() => NoticeCriteriaEntity, (criteria) => criteria.notice, { cascade: true })
  criteria: NoticeCriteriaEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;
}
