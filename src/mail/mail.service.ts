import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EMailService {
  constructor(private mailerService: MailerService) {}

  sendMail(options: any): void {
    const { email, subject, template, context } = options;

    this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_MAIL,
      subject,
      template,
      context,
    });
  }
}
