import {
  PAY_API_URL,
  PAY_CHECKSUM_KEY,
  PAY_MERCHANT_KEY,
  PAY_SECRET_KEY,
} from './../../common/constants/environment.constant';
import { Injectable } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { IPaymentParams, IPaymentResult } from 'src/common/interfaces/payment.interface';
import * as moment from 'moment';
import { IPN9PayDto } from './dto/ipn-9pay.dto';
import axios from 'axios';
import { CheckAccountDto } from './dto/check-account.dto';

@Injectable()
export class PaymentService {
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

  async checkAccount(account: CheckAccountDto) {
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

    console.log(result);
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
}
