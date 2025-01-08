import { StoreEntity } from './store.entity';
import { ClientEntity } from './client.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('store_likes')
export class StoreLikeEntity {
  @PrimaryColumn({ name: 'store_id' })
  storeId: number;

  @PrimaryColumn({ name: 'client_id' })
  clientId: number;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
