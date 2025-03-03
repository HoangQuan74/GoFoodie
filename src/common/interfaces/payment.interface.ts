import { EPaymentMethod } from '../enums';

export interface IPaymentParams {
  amount: number;
  invoiceNo: string;
  description?: string;
  returnUrl: string;
  method: EPaymentMethod;
  transactionType?: string;
}
