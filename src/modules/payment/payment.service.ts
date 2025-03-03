import { PAY_API_URL, PAY_MERCHANT_KEY, PAY_SECRET_KEY } from './../../common/constants/environment.constant';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { IPaymentParams } from 'src/common/interfaces/payment.interface';
import * as moment from 'moment';

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
    console.log(parameters);
    const httpQuery = this.buildHttpQuery(parameters);
    const message = 'POST' + '\n' + PAY_API_URL + '/payments/create' + '\n' + parameters.time + '\n' + httpQuery;
    const signature = this.buildSignature(message);
    const baseEncode = Buffer.from(JSON.stringify(parameters)).toString('base64');
    const httpBuild = { baseEncode: baseEncode, signature: signature };

    return PAY_API_URL + '/portal?' + this.buildHttpQuery(httpBuild);
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
}
