import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';
import { CustomThrottlerGuard } from '../../src/core/guards/custom-throttler.guard';
import { ROUTER_PATH } from '../../src/core/path/router.path';
import { EmailConfirmationSenderService } from '../../src/modules/notifications/application/service/email-confirmation-sender.service';
import { setupApp } from '../../src/setup/setup-app';
import { emailSenderMock } from './common/email-sender.mock';

export async function initSettings(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    // auth endpoints are rate-limited; tests hit them many times in a row
    .overrideGuard(CustomThrottlerGuard)
    .useValue({ canActivate: () => true })
    // no real emails — codes are captured by the mock
    .overrideProvider(EmailConfirmationSenderService)
    .useValue(emailSenderMock)
    .compile();

  const app: INestApplication<App> = moduleFixture.createNestApplication();
  setupApp(app);
  await app.init();

  return app;
}

export async function deleteAllData(app: INestApplication<App>): Promise<void> {
  await request(app.getHttpServer()).delete(ROUTER_PATH.testing).expect(204);
}
