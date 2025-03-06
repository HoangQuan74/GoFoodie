import { EPaymentMethod } from '../enums';

export interface IPaymentParams {
  amount: number;
  invoiceNo: string;
  description?: string;
  returnUrl: string;
  method: EPaymentMethod;
  transactionType?: string;
}

export interface IDisbursementParams {
  amount: number;
  description: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  accountType: string;
  requestId: string;
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

export interface ICheckAccountResult {
  status: number;
  error_code: number;
  message: string;
  request_id: string;
  bank_code: string;
  account_no: string;
  account_name?: string;
  account_type: string;
}
