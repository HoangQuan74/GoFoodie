import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DriverEntity } from './driver.entity';
import { BaseEntity } from './base.entity';
import { decrypt, encrypt } from 'src/utils/bcrypt';

@Entity('driver_cards')
export class DriverCardEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'card_number', transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) } })
  cardNumber: string;

  @Column({ name: 'card_holder' })
  cardHolder: string;

  @Column({ name: 'expired_date' })
  expiredDate: Date;

  @Column({
    name: 'cvc_code',
    transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) },
    select: false,
  })
  cvcCode: string;

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
