import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export const setupApp = (app: INestApplication) => {
  app.enableCors();
  app.use(cookieParser());

  return app;
};
