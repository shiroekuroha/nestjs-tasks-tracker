import { Controller, Post } from '@nestjs/common';

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  sendTestMail() {
    this.mailService.sendMail(
      'dnguyen3995@gmail.com',
      'Test Email',
      'This is a test email, no need to panic, yet!',
    );
    return { data: 'true' };
  }
}
