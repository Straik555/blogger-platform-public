import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailExamples } from './application/email-examples';
import { EmailService } from './application/service/email.service';
import { EmailConfirmationSenderService } from './application/service/email-confirmation-sender.service';
import { NotificationsConfig } from './config/notifications.config';
import { NotificationsConfigModule } from './config/notifications-config.module';

@Module({
  imports: [
    NotificationsConfigModule,
    MailerModule.forRootAsync({
      imports: [NotificationsConfigModule],
      useFactory: (notificationsConfig: NotificationsConfig) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: notificationsConfig.email,
            pass: notificationsConfig.emailPass,
          },
        },
        defaults: {
          from: `MyBlogger <${notificationsConfig.email}>`,
        },
      }),
      inject: [NotificationsConfig],
    }),
  ],
  providers: [EmailService, EmailExamples, EmailConfirmationSenderService],
  exports: [EmailConfirmationSenderService],
})
export class NotificationsModule {}
