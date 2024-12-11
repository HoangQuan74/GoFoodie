import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BASE_URL } from 'src/common/constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPassword(email: string, otp: string, name: string) {
    try {
      const logo = BASE_URL + '/public/logo.png';
      const headerBg = BASE_URL + '/public/header-bg.png';
      return await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password',
        template: 'forgot-password',
        context: { otp, email, logo, name, headerBg },
      });
    } catch (message) {
      return console.error(message);
    }
  }
}
