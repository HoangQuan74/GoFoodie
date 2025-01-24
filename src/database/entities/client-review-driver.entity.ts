import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ClientEntity } from './client.entity';
import { DriverEntity } from './driver.entity';
import { OrderEntity } from './order.entity';
import { ReviewTemplateEntity } from './review-template.entity';

@Entity('client_review_drivers')
export class ClientReviewDriverEntity extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToMany(() => ReviewTemplateEntity, (reviewTemplate) => reviewTemplate.id)
  @JoinTable({
    name: 'client_review_driver_templates',
    joinColumn: { name: 'client_review_driver_id' },
    inverseJoinColumn: { name: 'review_template_id' },
  })
  templates: ReviewTemplateEntity[];

  @ManyToOne(() => ClientEntity, (client) => client.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => DriverEntity, (driver) => driver.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => OrderEntity, (order) => order.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
