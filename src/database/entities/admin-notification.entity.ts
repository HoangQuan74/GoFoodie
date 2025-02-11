import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EUserType } from 'src/common/enums';
import { ProvinceEntity } from './province.entity';
import { ENotificationRelatedType } from 'src/common/enums';
import { FileEntity } from './file.entity';

@Entity('admin_notifications')
export class AdminNotificationEntity extends BaseEntity {
  @Column({ name: 'image_id', nullable: true })
  imageId: number;

  @Column({ name: 'from' })
  from: string;

  @Column({ type: 'enum', enum: EUserType, name: 'user_type' })
  userType: EUserType;

  @Column({ name: 'path', nullable: true })
  path: string;

  @Column({ name: 'related_type', type: 'enum', enum: ENotificationRelatedType, nullable: true })
  relatedType: ENotificationRelatedType;

  @Column({ name: 'related_id', nullable: true })
  relatedId: number;

  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;

  @ManyToOne(() => ProvinceEntity, (province) => province.id)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;
}
