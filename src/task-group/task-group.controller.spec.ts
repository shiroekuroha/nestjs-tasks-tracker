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

  describe('GET', () => {
    describe('GetTaskGroups', () => {
      it('should return all taskGroups', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((taskGroup) => {
              expect(taskGroup).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
                position: expect.any(Number),
                projectId: expect.any(Number),
              });
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial taskGroups, changed limit', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups?limit=1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((taskGroup) => {
              expect(taskGroup).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
                position: expect.any(Number),
                projectId: expect.any(Number),
              });
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });

            expect(res.body.data.length).toBe(1);
          });
      });

      it('should return partial taskGroups, even if limit is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups?limit=100`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((taskGroup) => {
              expect(taskGroup).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
                position: expect.any(Number),
                projectId: expect.any(Number),
              });
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial taskGroups, changed page', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups?limit=1&page=2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((taskGroup) => {
              expect(taskGroup).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
                position: expect.any(Number),
                projectId: expect.any(Number),
              });
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });

            expect(res.body.data.length).toBe(1);
          });
      });

      it('should return partial taskGroups, even if page is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups?limit=10&page=100`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });

            expect(res.body.data.length).toBe(0);
          });
      });

      it('should return partial taskGroups, even if page is 0', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups?page=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((taskGroup) => {
              expect(taskGroup).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
                position: expect.any(Number),
                projectId: expect.any(Number),
              });
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial taskGroups, even if limit is 0', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups?limit=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((taskGroup) => {
              expect(taskGroup).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
                position: expect.any(Number),
                projectId: expect.any(Number),
              });
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });
    });

    describe('GetTaskGroup', () => {
      it('should return a taskGroup', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              color: expect.any(String),
              position: expect.any(Number),
              projectId: expect.any(Number),
            });
          });
      });

      it('should return NOT_FOUND for accessing taskGroup with invalid id, out of range', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups/99999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return BAD_REQUEST for accessing taskGroup with invalid id, wrong data type', async () => {
        await request(app.getHttpServer())
          .get(`/taskGroups/badId`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PUT', () => {
    describe('UpdateTaskGroup', () => {
      it('should update and return taskGroup, name', async () => {
        await request(app.getHttpServer())
          .put(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'This is a unique name!',
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              color: expect.any(String),
              position: expect.any(Number),
              projectId: expect.any(Number),
            });

            expect(res.body.data.name).toBe('This is a unique name!');
          });
      });

      it('should update and return taskGroup, color', async () => {
        await request(app.getHttpServer())
          .put(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            color: '#420d20',
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              color: expect.any(String),
              position: expect.any(Number),
              projectId: expect.any(Number),
            });

            expect(res.body.data.color).toBe('#420d20');
          });
      });

      it('should not update, throw bad request, name: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not update, throw bad request, name: unique constraint violation', async () => {
        await request(app.getHttpServer())
          .put(`/taskGroups/2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'This is a unique name!',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should update and return taskGroup, color', async () => {
        await request(app.getHttpServer())
          .put(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            color: 'concentrate',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('POST', () => {
    describe('CreateTaskGroup', () => {
      it('should create a taskGroup', async () => {
        await request(app.getHttpServer())
          .post(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task Group 100',
            color: '#7f495d',
          })
          .expect(HttpStatus.CREATED)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              color: expect.any(String),
              position: expect.any(Number),
              projectId: expect.any(Number),
            });

            expect(res.body.data.name).toBe('New Task Group 100');
            expect(res.body.data.color).toBe('#7f495d');
          });
      });

      it('should not create a taskGroup, bad name: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 100_000,
            color: '#7f495d',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a taskGroup, bad name: unique constraint violation', async () => {
        await request(app.getHttpServer())
          .post(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task Group 100',
            color: '#7f495d',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a taskGroup, bad color', async () => {
        await request(app.getHttpServer())
          .post(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task Group 101',
            color: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('DELETE', () => {
    describe('DeleteTaskGroup', () => {
      it('should create and then delete a taskGroup', async () => {
        const newTaskGroup = await request(app.getHttpServer())
          .post(`/taskGroups/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task Group 102',
            color: '#7f495d',
          })
          .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
          .delete(`/taskGroups/${newTaskGroup.body.data.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NO_CONTENT);
      });

      it('should not delete a taskGroup, bad id: no permission to delete', async () => {
        await request(app.getHttpServer())
          .delete(`/taskGroups/999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
});
