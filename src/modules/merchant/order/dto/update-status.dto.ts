import { OrderStatus } from 'src/database/entities/order.entity';

export class UpdateOrderStatusDto {
  status: OrderStatus;
}
