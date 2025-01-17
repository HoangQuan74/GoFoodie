import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClientEntity } from './client.entity';
import { MerchantEntity } from './merchant.entity';
import { DriverEntity } from './driver.entity';

@Entity('fcm_histories')
export class FcmHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'user_type' })
  userType: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ name: 'is_success', nullable: true })
  isSuccess: boolean;

  @Column({ name: 'sent_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @ManyToOne(() => ClientEntity, (client) => client.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  client: ClientEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  merchant: MerchantEntity;

  @ManyToOne(() => DriverEntity, (driver) => driver.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  driver: DriverEntity;
}
