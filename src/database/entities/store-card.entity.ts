import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { decrypt, encrypt } from 'src/utils/bcrypt';
import { StoreEntity } from './store.entity';
import { ECardType } from 'src/common/enums';

@Entity('store_cards')
export class StoreCardEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'bank_code' })
  bankCode: string;

  @Column({ name: 'type' })
  type: ECardType;

  @Column({ name: 'card_number', transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) } })
  cardNumber: string;

  @Column({ name: 'card_holder' })
  cardHolder: string;

  @Column({ name: 'expiry_date' })
  expiryDate: string;

  @Column({
    name: 'cvv',
    transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) },
    nullable: true,
  })
  cvv: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
