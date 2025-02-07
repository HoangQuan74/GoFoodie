import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';


@Entity('admin_notifications')
export class AdminNotificationEntity extends BaseEntity {
  // ảnh 

  @Column({ name: 'title' })
  title: string;

  //   @Column({ name: 'message' })
  //   message: string;

  @Column({ name: 'path', nullable: true })
  path: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;
}
