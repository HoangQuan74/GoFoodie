import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPasswordForAdmin(email: string, otp: string) {
    try {
      return await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password',
        template: 'forgot-password',
        context: { otp, email },
      });
    } catch (message) {
      return console.error(message);
    }
  }
}
