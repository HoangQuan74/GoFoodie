import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EStoreNotificationType } from 'src/common/enums';
import { FileEntity } from './file.entity';
import { StoreEntity } from './store.entity';

@Entity('store_notifications')
export class StoreNotificationEntity extends BaseEntity {
  @Column({ name: 'image_id', nullable: true })
  imageId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ type: 'enum', enum: EStoreNotificationType })
  type: EStoreNotificationType;

  @Column({ name: 'related_id', nullable: true })
  relatedId: number;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
