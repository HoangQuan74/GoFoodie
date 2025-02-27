import { PAY_SECRET_KEY } from './../../common/constants/environment.constant';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class PaymentService {
  //   returnUrl = 'http://fcdcc4767acb.ngrok.io/';
  //   httpQuery = buildHttpQuery(parameters);
  //   message = 'POST' + '\n' + END_POINT + '/payments/create' + '\n' + time + '\n' + httpQuery;
  //   signature = buildSignature(message, MERCHANT_SECRET_KEY);
  //   baseEncode = Buffer.from(JSON.stringify(parameters)).toString('base64');
  //   httpBuild = {
  //     baseEncode: baseEncode,
  //     signature: signature,
  //   };

  async transfer9Pay() {
    // const parameters = {
    //   merchantKey: PAY_MERCHANT_KEY,
    //   time: new Date().getTime(),
    //   invoice_no: '123456',
    //   amount: 10000,
    //   description: 'Thanh toán đơn hàng',
    //   return_url: this.returnUrl,
    //   method: 'CREDIT_CARD',
    //   transaction_type: 'CARD_AUTHORIZATION',
    // };
    // tạo url thanh toán
  }

  buildHttpQuery(data: any) {
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

  private buildSignature(data: any) {
    return createHmac('sha256', PAY_SECRET_KEY).update(data).digest().toString('base64');
  }
}
