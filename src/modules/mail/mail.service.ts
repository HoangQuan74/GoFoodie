import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BASE_URL } from 'src/common/constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPasswordForAdmin(email: string, otp: string, name: string) {
    try {
      const logo = BASE_URL + '/public/logo.png';
      const headerImage = BASE_URL + '/public/header-image.png';
      return await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password',
        template: 'forgot-password',
        context: { otp, email, logo, name, headerImage },
      });
    } catch (message) {
      return console.error(message);
    }
  }
}
