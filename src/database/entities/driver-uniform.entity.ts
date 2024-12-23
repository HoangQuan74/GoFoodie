import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';
import { EDriverUniformPaymentMethod, EDriverUniformStatus } from 'src/common/enums/driver.enum';
import { UniformSizeEntity } from './uniform-size.entity';

@Entity('driver_uniforms')
export class DriverUniformEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'ship_fee' })
  shipFee: number;

  @Column({ name: 'uniform_fee' })
  uniformFee: number;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'size_id' })
  sizeId: number;

  @Column({ type: 'enum', enum: EDriverUniformStatus, default: EDriverUniformStatus.Ordered })
  status: EDriverUniformStatus;

  @Column({ name: 'payment_method', type: 'enum', enum: EDriverUniformPaymentMethod })
  paymentMethod: EDriverUniformPaymentMethod;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => UniformSizeEntity, (size) => size.id)
  @JoinColumn({ name: 'size_id' })
  size: UniformSizeEntity;
}
