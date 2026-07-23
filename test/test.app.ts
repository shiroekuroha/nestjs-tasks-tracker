// test/utils/test-app.ts

import request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../src/analytics/analytics.interceptor';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/exceptions/global.exception-filter';
import { WrappersInterceptor } from '../src/wrappers/wrappers.interceptor';

export interface TestContext {
  app: INestApplication;
  accessToken: string;
}

export async function createTestApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    app.get(AnalyticsInterceptor),
    app.get(WrappersInterceptor),
  );

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  await app.init();

  const response = await request(app.getHttpServer()).post('/auth/login').send({
    username: 'dnguyen1',
    password: '!Admin123',
  });

  return {
    app: app,
    accessToken: response.body.data.access_token,
  };
}
