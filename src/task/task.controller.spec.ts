import request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../exceptions/global.exception-filter';
import { PrismaService } from '../prisma/prisma.service';
import { WrappersInterceptor } from '../wrappers/wrappers.interceptor';

describe('TaskController (e2e)', () => {
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
    describe('GetTasks', () => {
      it('should return all tasks', async () => {
        await request(app.getHttpServer())
          .get(`/tasks/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial tasks, changed limit', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?limit=1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
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

      it('should return partial tasks, even if limit is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?limit=100`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial tasks, changed page', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?limit=1&page=2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial tasks, changed page', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?limit=1&page=2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial tasks, even if page is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?limit=10&page=100`)
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
          });
      });

      it('should return partial tasks, even if page is 0', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?page=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
            });

            expect(res.body.meta).toMatchObject({
              page: expect.any(Number),
              item: expect.any(Number),
              total_pages: expect.any(Number),
              total_items: expect.any(Number),
            });
          });
      });

      it('should return partial tasks, even if limit is 0', async () => {
        await request(app.getHttpServer())
          .get(`/tasks?limit=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((task) => {
              expect(task).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                position: expect.any(Number),
                status: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                taskGroupId: expect.any(Number),
              });

              expect(
                task.startDate == null || typeof task.startDate == 'string',
              ).toBe(true);

              expect(
                task.dueDate == null || typeof task.dueDate == 'string',
              ).toBe(true);
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

    describe('GetTask', () => {
      it('should return a task', async () => {
        await request(app.getHttpServer())
          .get(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              position: expect.any(Number),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              taskGroupId: expect.any(Number),
            });

            expect(
              res.body.data.startDate == null ||
                typeof res.body.data.startDate == 'string',
            ).toBe(true);

            expect(
              res.body.data.dueDate == null ||
                typeof res.body.data.dueDate == 'string',
            ).toBe(true);
          });
      });

      it('should return NOT_FOUND for accessing task with invalid id, out of range', async () => {
        await request(app.getHttpServer())
          .get(`/tasks/99999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return BAD_REQUEST for accessing task with invalid id, wrong data type', async () => {
        await request(app.getHttpServer())
          .get(`/tasks/badId`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PUT', () => {
    describe('UpdateTask', () => {
      it('should update and return a task, name', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'This is a pretty unique name',
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              position: expect.any(Number),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              taskGroupId: expect.any(Number),
            });

            expect(
              res.body.data.startDate == null ||
                typeof res.body.data.startDate == 'string',
            ).toBe(true);

            expect(
              res.body.data.dueDate == null ||
                typeof res.body.data.dueDate == 'string',
            ).toBe(true);

            expect(res.body.data.name).toBe('This is a pretty unique name');
          });
      });

      it('should update and return a task, description', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            description: 'This is not a unique description',
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              position: expect.any(Number),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              taskGroupId: expect.any(Number),
            });

            expect(
              res.body.data.startDate == null ||
                typeof res.body.data.startDate == 'string',
            ).toBe(true);

            expect(
              res.body.data.dueDate == null ||
                typeof res.body.data.dueDate == 'string',
            ).toBe(true);

            expect(res.body.data.description).toBe(
              'This is not a unique description',
            );
          });
      });

      it('should update and return a task, status', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            status: 'DONE',
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              position: expect.any(Number),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              taskGroupId: expect.any(Number),
            });

            expect(
              res.body.data.startDate == null ||
                typeof res.body.data.startDate == 'string',
            ).toBe(true);

            expect(
              res.body.data.dueDate == null ||
                typeof res.body.data.dueDate == 'string',
            ).toBe(true);

            expect(res.body.data.status).toBe('DONE');
          });
      });

      it('should update and return a task, startDate/dueDate', async () => {
        const now = new Date();

        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            startDate: now,
            dueDate: now,
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              position: expect.any(Number),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              taskGroupId: expect.any(Number),
            });

            expect(
              res.body.data.startDate == null ||
                typeof res.body.data.startDate == 'string',
            ).toBe(true);

            expect(
              res.body.data.dueDate == null ||
                typeof res.body.data.dueDate == 'string',
            ).toBe(true);

            expect(res.body.data.startDate).toBe(now.toISOString());
            expect(res.body.data.dueDate).toBe(now.toISOString());
          });
      });

      it('should not update, name: unique constraint violation', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'This is a pretty unique name',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not update, name: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not update, description: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            description: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not update, status: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            status: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not update, startDate/dueDate: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            startDate: '1001010',
            dueDate: '2919291',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('POST', () => {
    describe('CreateTask', () => {
      it('should create and return a task', async () => {
        await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task 100',
            description: 'This is just a description',
            status: 'TODO',
            startDate: null,
            dueDate: null,
          })
          .expect(HttpStatus.CREATED)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              position: expect.any(Number),
              status: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              taskGroupId: expect.any(Number),
            });

            expect(
              res.body.data.startDate == null ||
                typeof res.body.data.startDate == 'string',
            ).toBe(true);

            expect(
              res.body.data.dueDate == null ||
                typeof res.body.data.dueDate == 'string',
            ).toBe(true);
          });
      });

      it('should not create a task, name: unique constraint violation', async () => {
        await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task 100',
            description: 'This is just a description',
            status: 'TODO',
            startDate: null,
            dueDate: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, name: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 100_000,
            description: 'This is just a description',
            status: 'TODO',
            startDate: null,
            dueDate: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, description: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task 101',
            description: 100_000,
            status: 'TODO',
            startDate: null,
            dueDate: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, status: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task 101',
            description: 'This is just a description',
            status: 'TODOs',
            startDate: null,
            dueDate: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, startDate/dueDate: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task 101',
            description: 'This is just a description',
            status: 'TODO',
            startDate: 'Junk',
            dueDate: 'Junk',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('DELETE', () => {
    describe('DeleteTask', () => {
      it('should create and then delete a task', async () => {
        const newTask = await request(app.getHttpServer())
          .post(`/tasks/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Task 102',
            description: 'This is just a description',
            status: 'TODO',
            startDate: null,
            dueDate: null,
          })
          .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
          .delete(`/tasks/${newTask.body.data.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NO_CONTENT);
      });

      it('should not delete a task, bad id: no permission to delete', async () => {
        await request(app.getHttpServer())
          .delete(`/tasks/999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
});
