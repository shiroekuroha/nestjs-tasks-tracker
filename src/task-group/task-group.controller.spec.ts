import request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../exceptions/global.exception-filter';
import { PrismaService } from '../prisma/prisma.service';
import { WrappersInterceptor } from '../wrappers/wrappers.interceptor';

describe('TaskGroupController (e2e)', () => {
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
      .get('/taskGroups')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return all taskGroups', async () => {
    await request(app.getHttpServer())
      .get('/taskGroups')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toBeDefined();

        res.body.data.forEach((element) => {
          expect(element).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            position: expect.any(Number),
          });
        });

        expect(res.body.meta).toBeDefined();
      });
  });

  it('should return a task by id', async () => {
    await request(app.getHttpServer())
      .get('/taskGroups/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toBeDefined();

        expect(res.body.data).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          position: expect.any(Number),
        });
      });
  });

  it('should return 400 for an invalid task id', async () => {
    await request(app.getHttpServer())
      .get('/taskGroups/test')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 404 when task id does not exist', async () => {
    await request(app.getHttpServer())
      .get('/taskGroups/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should update a task', async () => {
    await request(app.getHttpServer())
      .put('/taskGroups/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Task',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.name).toBe('Updated Task');
      });
  });

  it('should create a task', async () => {
    await request(app.getHttpServer())
      .post('/taskGroups/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Task Group 1',
        color: '#00000000',
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data.name).toBe('New Task Group 1');
      });
  });

  it('should return 400 when creating a role with invalid data', async () => {
    await request(app.getHttpServer())
      .post('/taskGroups/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should delete a task', async () => {
    await request(app.getHttpServer())
      .delete('/taskGroups/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 after the task has been deleted', async () => {
    await request(app.getHttpServer())
      .get('/taskGroups/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 403 when deleting a non-existent task(outside of permission scope)', async () => {
    await request(app.getHttpServer())
      .delete('/taskGroups/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });
});
