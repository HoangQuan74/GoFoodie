import { EDiscountType, EMaxDiscountType } from 'src/common/enums/voucher.enum';
import { OrderEntity } from 'src/database/entities/order.entity';
import { VoucherEntity } from 'src/database/entities/voucher.entity';

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

export function calculateDriverIncome(order: OrderEntity): number {
  // B1: Delivery fee
  const B1 = Number(order.orderFeeDiscount?.driverDeliveryFee) || 0;

  // B2: Tip
  const B2 = Number(order.orderFeeDiscount?.driverTip) || 0;

  // B3: Peak hour fee
  const B3 = Number(order.orderFeeDiscount?.driverPeakHourFee) || 0;

  // B4: Parking fee
  const B4 = Number(order.orderFeeDiscount?.driverParkingFee) || 0;

  // Final driver income
  return B1 + B2 + B3 + B4;
}

export function calculateClientTotalPaid(order: OrderEntity, vouchers?: VoucherEntity[]): number {
  // B1: Total amount after dish discounts
  const B1 = Number(order.totalAmount) || 0;

  // B2: Delivery fee
  const B2 = Number(order.deliveryFee) || 0;

  // B3: App fee
  const B3 = Number(order.clientAppFee) || 0;

  // B4: Parking fee
  const B4 = Number(order.parkingFee) || 0;

  // B5: Tip
  const B5 = Number(order.tip) || 0;

  // B6: Peak hour fee
  const B6 = Number(order.peakHourFee) || 0;

  // Final client total paid
  return B1 + B2 + B3 + B4 + B5 + B6;
}

export function calculateVoucherDiscount(voucher: VoucherEntity, totalAmount?: number): number {
  if (!voucher) return 0;

  const { discountValue, discountType, maxDiscountValue, maxDiscountType } = voucher;

  if (discountType === EDiscountType.Fixed) {
    return +discountValue;
  } else if (discountType === EDiscountType.Percentage) {
    const value = (+discountValue * totalAmount) / 100;

    if (maxDiscountType === EMaxDiscountType.Limited) {
      return Math.min(value, maxDiscountValue);
    }

    return +value;
  }

  return 0;
}
