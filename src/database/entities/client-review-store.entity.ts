import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ClientEntity } from './client.entity';
import { StoreEntity } from './store.entity';
import { OrderEntity } from './order.entity';
import { FileEntity } from './file.entity';
import { ReviewTemplateEntity } from './review-template.entity';

@Entity('client_review_stores')
export class ClientReviewStoreEntity extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToMany(() => ReviewTemplateEntity, (reviewTemplate) => reviewTemplate.id)
  @JoinTable({
    name: 'client_review_store_templates',
    joinColumn: { name: 'client_review_store_id' },
    inverseJoinColumn: { name: 'review_template_id' },
  })
  templates: ReviewTemplateEntity[];

  @Column({ name: 'is_anonymous', default: false })
  isAnonymous: boolean;

  @ManyToMany(() => FileEntity, (file) => file.id)
  @JoinTable({
    name: 'client_review_store_files',
    joinColumn: { name: 'client_review_store_id' },
    inverseJoinColumn: { name: 'file_id' },
  })
  files: FileEntity[];

  @ManyToOne(() => ClientEntity, (client) => client.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => OrderEntity, (order) => order.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
