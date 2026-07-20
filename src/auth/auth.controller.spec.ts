import request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../exceptions/global.exception-filter';
import { PrismaService } from '../prisma/prisma.service';
import { WrappersInterceptor } from '../wrappers/wrappers.interceptor';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken = '';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(
      new AnalyticsInterceptor(),
      new WrappersInterceptor(),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'dnguyen1',
        password: '!Admin123',
      })
      .expect(HttpStatus.OK);

    accessToken = response.body.data.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not login', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'gibberishThatDoenstsatasas',
        password: '!@@**#FDjhfjskfjKDLK91471074',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should be bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'gibberishThatDoenstsatasas',
        password: 'sdfasjfkasfja;sjf;aj',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should not show anything', async () => {
    await request(app.getHttpServer())
      .get('/auth/member')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
