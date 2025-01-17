import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BASE_URL } from 'src/common/constants';
import logger from 'src/logger/winston-daily-rotate-file.logger';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtp(email: string, otp: string, name: string) {
    try {
      const logo = BASE_URL + '/public/logo.png';
      const headerBg = BASE_URL + '/public/header-bg.png';
      console.log('Sending OTP to', email);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Goo++: Mã OTP để xác nhận tài khoản',
        template: 'forgot-password',
        context: { otp, email, logo, name, headerBg },
      });
    } catch (message) {
      logger.error(message);
    }
  }
}
