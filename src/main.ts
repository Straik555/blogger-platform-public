import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CoreConfig } from './core/config/core.config';
import { setupApp } from './setup/setup-app';
import { swaggerSetup } from './setup/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  setupApp(app);
  if (coreConfig.isSwaggerEnabled) {
    swaggerSetup(app);
  }
  await app.listen(coreConfig.port);
}
bootstrap();
