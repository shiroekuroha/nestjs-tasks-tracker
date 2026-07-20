import request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../exceptions/global.exception-filter';
import { PrismaService } from '../prisma/prisma.service';
import { WrappersInterceptor } from '../wrappers/wrappers.interceptor';

describe('MemberController (e2e)', () => {
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

  it('should return 401 when unauthenticated', async () => {
    await request(app.getHttpServer())
      .get('/members')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return all members', async () => {
    await request(app.getHttpServer())
      .get('/members')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toBeDefined();

        res.body.data.forEach((element) => {
          expect(element).toMatchObject({
            id: expect.any(Number),
            username: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            birthdate: expect.any(String),
            email: expect.any(String),
          });

          expect(new Date(element.birthdate).toString()).not.toBe(
            'Invalid Date',
          );
        });

        expect(res.body.meta).toBeDefined();
      });
  });

  it('should return a member by id', async () => {
    await request(app.getHttpServer())
      .get('/members/id/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toMatchObject({
          id: expect.any(Number),
          username: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          birthdate: expect.any(String),
          email: expect.any(String),
        });

        expect(new Date(res.body.data.birthdate).toString()).not.toBe(
          'Invalid Date',
        );
      });
  });

  it('should return 400 for an invalid member id', async () => {
    await request(app.getHttpServer())
      .get('/members/id/dnguyen1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 404 when member id does not exist', async () => {
    await request(app.getHttpServer())
      .get('/members/id/1291291')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return a member by username', async () => {
    await request(app.getHttpServer())
      .get('/members/username/dnguyen1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toMatchObject({
          id: expect.any(Number),
          username: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          birthdate: expect.any(String),
          email: expect.any(String),
        });

        expect(new Date(res.body.data.birthdate).toString()).not.toBe(
          'Invalid Date',
        );
      });
  });

  it('should return 404 when username does not exist', async () => {
    await request(app.getHttpServer())
      .get('/members/username/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should update a member by id', async () => {
    await request(app.getHttpServer())
      .put('/members/id/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        firstName: 'Nova',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.firstName).toBe('Nova');
      });
  });

  it('should update a member by username', async () => {
    await request(app.getHttpServer())
      .put('/members/username/kcurtiss1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        lastName: 'Corsair',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.lastName).toBe('Corsair');
      });
  });

  it('should create a member', async () => {
    await request(app.getHttpServer())
      .post('/members/')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'TestUser',
        password: '*Test1111',
        firstName: 'Test',
        lastName: 'User',
        birthdate: new Date(),
        email: 'test.user@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data.username).toBe('TestUser');
      });
  });

  it('should delete a member', async () => {
    await request(app.getHttpServer())
      .delete('/members/id/4')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 after the member has been deleted', async () => {
    await request(app.getHttpServer())
      .get('/members/id/4')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 404 when deleting a non-existent member', async () => {
    await request(app.getHttpServer())
      .delete('/members/id/42000')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
