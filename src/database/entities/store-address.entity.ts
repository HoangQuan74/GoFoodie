import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { StoreEntity } from './store.entity';
import { EStoreAddressType } from 'src/common/enums';

@Entity('store_address')
@Unique(['storeId', 'type'])
export class StoreAddressEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'building', nullable: true })
  building: string;

  @Column({ name: 'gate', nullable: true })
  gate: string;

  @Column({ name: 'lat', type: 'float' })
  lat: number;

  @Column({ name: 'lng', type: 'float' })
  lng: number;

  @Column({ type: 'enum', enum: EStoreAddressType })
  type: EStoreAddressType;

  @Column({ name: 'note', nullable: true })
  note: string;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
