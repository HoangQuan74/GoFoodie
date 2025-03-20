import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DriverEntity } from './driver.entity';
import { BaseEntity } from './base.entity';
import { decrypt, encrypt } from 'src/utils/bcrypt';
import { ECardType, EPaymentMethod } from 'src/common/enums';

@Entity('driver_cards')
export class DriverCardEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'type' })
  type: ECardType;

  @Column({ name: 'bank_code' })
  bankCode: string;

  @Column({ name: 'card_number', transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) } })
  cardNumber: string;

  @Column({ name: 'card_holder' })
  cardHolder: string;

  @Column({ name: 'expiry_date' })
  expiryDate: string;

  @Column({ name: 'cvv', transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) } })
  cvv: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
}
