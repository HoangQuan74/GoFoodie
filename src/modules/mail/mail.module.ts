import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST || 'pro34.emailserver.vn',
        port: +process.env.EMAIL_PORT || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER || 'cskh@oneshipdelivery.com',
          pass: process.env.EMAIL_PASS || 'OneShip@123!!!@@@###',
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.EMAIL_FROM}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
