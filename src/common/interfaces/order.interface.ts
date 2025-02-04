import { OrderEntity } from 'src/database/entities/order.entity';

export interface OrderResponse extends Omit<OrderEntity, 'storeIncome'> {
  storeIncome: number;
}

export interface PaginatedOrderResponse {
  orders: OrderResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
