import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendMail(to: string, subject: string, content: string) {
    const result = await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text: content,

      mailSettings: {
        sandboxMode: {
          enable: true,
        },
      },
    });

    console.log(result);
  }
}
