import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(email: string, subject: string, message: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: message,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
