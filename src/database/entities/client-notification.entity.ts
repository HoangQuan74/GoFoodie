import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EClientNotificationType } from 'src/common/enums';
import { FileEntity } from './file.entity';
import { ClientEntity } from './client.entity';

@Entity('client_notifications')
export class ClientNotificationEntity extends BaseEntity {
  @Column({ name: 'image_id', nullable: true })
  imageId: string;

  @Column({ name: 'from', nullable: true })
  from: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ type: 'enum', enum: EClientNotificationType })
  type: EClientNotificationType;

  @Column({ name: 'related_id', nullable: true })
  relatedId: number;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
}
