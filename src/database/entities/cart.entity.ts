import { ClientEntity } from 'src/database/entities/client.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartProductEntity } from './cart-product.entity';

@Entity('carts')
export class CartEntity extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.cart)
  cartProducts: CartProductEntity[];
}
