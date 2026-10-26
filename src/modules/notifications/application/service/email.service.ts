import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, template: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your code is here',
      html: template,
    });
  }
}
