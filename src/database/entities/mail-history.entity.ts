import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mail_histories')
export class MailHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @Column({ name: 'sent_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;
}
