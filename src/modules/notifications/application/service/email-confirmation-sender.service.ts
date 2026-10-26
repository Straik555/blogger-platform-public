import { Injectable, Logger } from '@nestjs/common';

import { EmailExamples } from '../email-examples';
import { EmailService } from './email.service';
import { TemplateType } from './template.type';

@Injectable()
export class EmailConfirmationSenderService {
  private readonly logger = new Logger(EmailConfirmationSenderService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly emailExamples: EmailExamples,
  ) {}

  async send(
    email: string,
    code: string,
    template: TemplateType,
  ): Promise<void> {
    try {
      await this.emailService.sendConfirmationEmail(
        email,
        template === TemplateType.Registration
          ? this.emailExamples.registrationEmail(code)
          : this.emailExamples.recoverPasswordEmail(code),
      );
    } catch (error) {
      const loggerMessage =
        template === TemplateType.Registration
          ? 'The email has not been sent(registerUser):'
          : 'The email has not been sent(recoverPassword):';
      this.logger.warn(loggerMessage, error);
    }
  }
}
