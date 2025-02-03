import { OrderEntity } from 'src/database/entities/order.entity';

export function calculateStoreIncome(order: OrderEntity): number {
  // B1: Total amount after dish discounts
  const B1 = order.totalAmount || 0;

  // B2: Store discount/promotion amount
  const B2 = order.promoPrice || 0;

  // B3: Store's shipping fee contribution
  const shippingFeePercentage = 0;
  const B3 = (shippingFeePercentage * (order.deliveryFee || 0)) / 100;

  // B4: App fee
  const appFeePercentage = 0;
  const giftPercentage = 0;
  const giftAmount = (giftPercentage * (order.deliveryFee || 0)) / 100;
  const B4 = (appFeePercentage * (B1 - B2 - giftAmount)) / 100;

  // Final store income
  return B1 - B2 - B3 - B4;
}
