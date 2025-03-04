import { EPaymentMethod } from '../enums';

export interface IPaymentParams {
  amount: number;
  invoiceNo: string;
  description?: string;
  returnUrl: string;
  method: EPaymentMethod;
  transactionType?: string;
}

export interface IPaymentResult {
  amount: number;
  card_brand: string;
  description: string;
  error_code?: string;
  failure_reason?: string;
  invoice_no: string;
  method: EPaymentMethod;
  payment_no: string;
  status: number;
}
