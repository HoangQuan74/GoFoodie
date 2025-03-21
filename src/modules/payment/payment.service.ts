import {
  PAY_API_URL,
  PAY_CHECKSUM_KEY,
  PAY_MERCHANT_KEY,
  PAY_SECRET_KEY,
} from './../../common/constants/environment.constant';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import {
  IDisbursementParams,
  IPaymentParams,
  IPaymentResult,
  ICheckAccountResult,
} from 'src/common/interfaces/payment.interface';
import * as moment from 'moment';
import { IPN9PayDto } from './dto/ipn-9pay.dto';
import axios from 'axios';
import { CheckAccountDto } from './dto/check-account.dto';
import { CoinsService as MerchantCoinService } from '../merchant/coins/coins.service';
import { PaymentService as MerchantPaymentService } from '../merchant/payment/payment.service';
import { ETransactionStatus } from 'src/common/enums';
import { PaymentService as DriverPaymentService } from '../drivers/payment/payment.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => MerchantPaymentService))
    private readonly merchantPaymentService: MerchantPaymentService,

    @Inject(forwardRef(() => DriverPaymentService))
    private readonly driverPaymentService: DriverPaymentService,

    @Inject(forwardRef(() => MerchantCoinService))
    private readonly merchantCoinService: MerchantCoinService,
  ) {}

  private createParameters(data: IPaymentParams) {
    const { amount, description, returnUrl, method, invoiceNo } = data;
    const time = moment().unix();
    return {
      merchantKey: PAY_MERCHANT_KEY,
      time: time,
      invoice_no: invoiceNo,
      amount: amount,
      description: description || 'Thanh toán đơn hàng',
      return_url: returnUrl,
      method: method,
    };
  }

  async createPaymentUrl(data: IPaymentParams) {
    const parameters = this.createParameters(data);
    const httpQuery = this.buildHttpQuery(parameters);
    const message = 'POST' + '\n' + PAY_API_URL + '/payments/create' + '\n' + parameters.time + '\n' + httpQuery;
    const signature = this.buildSignature(message);
    const baseEncode = Buffer.from(JSON.stringify(parameters)).toString('base64');
    const httpBuild = { baseEncode: baseEncode, signature: signature };

    return PAY_API_URL + '/portal?' + this.buildHttpQuery(httpBuild);
  }

  async checkAccount(account: CheckAccountDto): Promise<ICheckAccountResult> {
    const time = moment().unix();
    const parameters = {
      request_id: time,
      bank_code: account.bankCode,
      account_no: account.accountNo,
      account_type: account.accountType,
    };

    const httpQuery = this.buildHttpQuery(parameters);
    const message = 'POST' + '\n' + PAY_API_URL + '/disbursement/check-account' + '\n' + time + '\n' + httpQuery;
    const signature = this.buildSignature(message);

    const result = await axios
      .post(PAY_API_URL + '/disbursement/check-account', parameters, {
        headers: {
          Date: time.toString(),
          Authorization: `Signature Algorithm=HS256,Credential=${PAY_MERCHANT_KEY},SignedHeaders=,Signature=${signature}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);

    return result;
  }

  async createDisbursement(data: IDisbursementParams) {
    const time = moment().unix();
    const parameters = {
      request_id: data.requestId,
      bank_code: data.bankCode,
      account_no: data.accountNo,
      account_name: data.accountName,
      amount: data.amount,
      description: data.description || 'Rut tien',
      account_type: data.accountType,
    };

    const httpQuery = this.buildHttpQuery(parameters);
    const message = 'POST' + '\n' + PAY_API_URL + '/disbursement/create' + '\n' + time + '\n' + httpQuery;
    const signature = this.buildSignature(message);

    const result = await axios
      .post(PAY_API_URL + '/disbursement/create', parameters, {
        headers: {
          Date: time.toString(),
          Authorization: `Signature Algorithm=HS256,Credential=${PAY_MERCHANT_KEY},SignedHeaders=,Signature=${signature}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);

    return result;
  }

  private buildHttpQuery(data: object) {
    const httpQuery = new URLSearchParams();

    const ordered = Object.keys(data)
      .sort()
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    Object.keys(ordered).forEach(function (parameterName) {
      httpQuery.append(parameterName, ordered[parameterName]);
    });
    return httpQuery.toString();
  }

  private buildSignature(data: string) {
    return createHmac('sha256', PAY_SECRET_KEY).update(data).digest().toString('base64');
  }

  async decodeResult(data: IPN9PayDto): Promise<IPaymentResult | null> {
    const { result, checksum } = data;

    const hashChecksum = createHash('sha256')
      .update(result + PAY_CHECKSUM_KEY)
      .digest('hex')
      .toUpperCase();

    if (hashChecksum === checksum) {
      const arrayParams = JSON.parse(Buffer.from(result, 'base64').toString('utf-8'));
      return arrayParams;
    } else {
      return null;
    }
  }

  async getManualResult(invoiceNo: string): Promise<IPaymentResult | null> {
    const time = moment().unix();
    const message = 'GET' + '\n' + PAY_API_URL + '/v2/payments/' + invoiceNo + '/inquire' + '\n' + time;
    const signature = this.buildSignature(message);

    const result = await axios
      .get(PAY_API_URL + '/v2/payments/' + invoiceNo + '/inquire', {
        headers: {
          Date: time.toString(),
          Authorization: `Signature Algorithm=HS256,Credential=${PAY_MERCHANT_KEY},SignedHeaders=,Signature=${signature}`,
        },
      })
      .then((res) => res.data);

    return result;
  }

  async handleIPN9Pay(data: IPaymentResult) {
    const { invoice_no: invoiceNo, status } = data;
    console.log('IPN 9Pay', data);
    const key = invoiceNo.slice(0, 2);

    switch (key) {
      case 'deposit':
        // code here
        break;

      // Kết quả giao dịch nạp, rút tiền của merchant
      case '10':
      case '11':
        if (status === 5 || status === 16) {
          this.merchantPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Success, data);
        } else if (status !== 2 && status !== 3) {
          this.merchantPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Failed, data);
        }
        break;
      case '13':
        if (status === 5 || status === 16) {
          this.merchantCoinService.updateTransactionStatus(invoiceNo, ETransactionStatus.Success, data);
        } else if (status !== 2 && status !== 3) {
          this.merchantCoinService.updateTransactionStatus(invoiceNo, ETransactionStatus.Failed, data);
        }
        break;
      // Kết quả giao dịch nạp, rút tiền của driver
      case '20':
      case '21':
        // code here
        if (status === 5 || status === 16) {
          this.driverPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Success, data);
        } else if (status !== 2 && status !== 3) {
          this.driverPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Failed, data);
        }
        break;
    }
  }
}
