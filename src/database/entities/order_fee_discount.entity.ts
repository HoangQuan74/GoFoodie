import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_fees_discounts')
export class OrderFeeDiscountEntity {
  @PrimaryColumn({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'driver_tip', type: 'int8', default: 0, comment: 'Tiền tip tài xế thực nhận' })
  driverTip: number;

  @Column({
    name: 'driver_delivery_fee',
    type: 'int8',
    default: 0,
    comment: 'Tiền phí giao hàng tài xế thực nhận',
  })
  driverDeliveryFee: number;

  @Column({
    name: 'driver_parking_fee',
    type: 'int8',
    default: 0,
    comment: 'Tiền phí gữi xe tài xế thực nhận',
  })
  driverParkingFee: number;

  @Column({
    name: 'driver_peak_hour_fee',
    type: 'int8',
    default: 0,
    comment: 'Tiền phí giờ cao điểm tài xế thực nhận',
  })
  driverPeakHourFee: number;

  @Column({
    name: 'order_discount_amount',
    type: 'int8',
    default: 0,
    comment: 'Số tiền giảm giá đơn hàng của client',
  })
  orderDiscountAmount: number;

  @Column({ name: 'is_store_order_voucher', default: false })
  isStoreOrderVoucher: boolean;

  @Column({
    name: 'delivery_fee_discount_amount',
    type: 'int8',
    default: 0,
    comment: 'Số tiền giảm giá phí giao hàng của client',
  })
  deliveryDiscountAmount: number;

  @Column({ name: 'is_store_delivery_voucher', default: false })
  isStoreDeliveryVoucher: boolean;

  @OneToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
