import { ClientEntity } from 'src/database/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('client_addresses')
export class ClientAddressEntity extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ nullable: true })
  building: string;

  @Column({ nullable: true })
  gate: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  note: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(() => ClientEntity, (client) => client.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
}
