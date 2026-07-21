import request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../exceptions/global.exception-filter';
import { PrismaService } from '../prisma/prisma.service';
import { WrappersInterceptor } from '../wrappers/wrappers.interceptor';

describe('ProjectController (e2e)', () => {
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
    describe('GetProjects', () => {
      it('should return all projects', async () => {
        await request(app.getHttpServer())
          .get(`/projects`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((project) => {
              expect(project).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
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

      it('should return partial projects, changed limit', async () => {
        await request(app.getHttpServer())
          .get(`/projects?limit=1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((project) => {
              expect(project).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
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

      it('should return partial projects, even if limit is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/projects?limit=100`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((project) => {
              expect(project).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
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

      it('should return partial projects, changed page', async () => {
        await request(app.getHttpServer())
          .get(`/projects?limit=1&page=2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((project) => {
              expect(project).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
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

      it('should return partial projects, even if page is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/projects?limit=10&page=100`)
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

      it('should return partial projects, even if page is 0', async () => {
        await request(app.getHttpServer())
          .get(`/projects?page=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((project) => {
              expect(project).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
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

      it('should return partial projects, even if limit is 0', async () => {
        await request(app.getHttpServer())
          .get(`/projects?limit=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((project) => {
              expect(project).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
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

    describe('GetProject', () => {
      it('should return a project', async () => {
        await request(app.getHttpServer())
          .get(`/projects/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
            });
          });
      });

      it('should return NOT_FOUND for accessing project with invalid id, out of range', async () => {
        await request(app.getHttpServer())
          .get(`/projects/99999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return BAD_REQUEST for accessing project with invalid id, wrong data type', async () => {
        await request(app.getHttpServer())
          .get(`/projects/badId`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PUT', () => {
    describe('UpdateProject', () => {
      it('should update and return project, name', async () => {
        await request(app.getHttpServer())
          .put(`/projects/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'This is a unique name!',
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
            });

            expect(res.body.data.name).toBe('This is a unique name!');
          });
      });

      it('should not update, throw bad request, name: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/projects/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('POST', () => {
    describe('CreateProject', () => {
      it('should create a project', async () => {
        await request(app.getHttpServer())
          .post(`/projects/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Project 100',
          })
          .expect(HttpStatus.CREATED)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
            });

            expect(res.body.data.name).toBe('New Project 100');
          });
      });

      it('should not create a project, bad name: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/projects/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('DELETE', () => {
    describe('DeleteProject', () => {
      it('should create and then delete a project', async () => {
        const newProject = await request(app.getHttpServer())
          .post(`/projects/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'New Project 102',
          })
          .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
          .delete(`/projects/${newProject.body.data.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NO_CONTENT);
      });

      it('should not delete a project, bad id: no permission to delete', async () => {
        await request(app.getHttpServer())
          .delete(`/projects/999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
});
