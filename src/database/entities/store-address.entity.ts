import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';
import { EStoreAddressType } from 'src/common/enums';

@Entity('store_address')
export class StoreAddressEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'building', nullable: true })
  building: string;

  @Column({ name: 'gate', nullable: true })
  gate: string;

  @Column({ name: 'lat' })
  lat: number;

  @Column({ name: 'lng' })
  lng: number;

  @Column({ type: 'enum', enum: EStoreAddressType })
  type: EStoreAddressType;

  @Column({ name: 'note', nullable: true })
  note: string;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
