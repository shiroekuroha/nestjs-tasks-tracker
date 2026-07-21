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

  describe('GET', () => {
    describe('GetMembers', () => {
      it('should return all members', async () => {
        await request(app.getHttpServer())
          .get(`/members`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((member) => {
              expect(member).toMatchObject({
                id: expect.any(Number),
                username: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                birthdate: expect.any(String),
                email: expect.any(String),
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

      it('should return partial members, changed limit', async () => {
        await request(app.getHttpServer())
          .get(`/members?limit=1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((member) => {
              expect(member).toMatchObject({
                id: expect.any(Number),
                username: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                birthdate: expect.any(String),
                email: expect.any(String),
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

      it('should return partial members, even if limit is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/members?limit=100`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((member) => {
              expect(member).toMatchObject({
                id: expect.any(Number),
                username: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                birthdate: expect.any(String),
                email: expect.any(String),
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

      it('should return partial members, changed page', async () => {
        await request(app.getHttpServer())
          .get(`/members?limit=1&page=2`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((member) => {
              expect(member).toMatchObject({
                id: expect.any(Number),
                username: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                birthdate: expect.any(String),
                email: expect.any(String),
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

      it('should return partial members, even if page is higher than total', async () => {
        await request(app.getHttpServer())
          .get(`/members?limit=10&page=200`)
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

      it('should return partial members, even if page is 0', async () => {
        await request(app.getHttpServer())
          .get(`/members?page=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((member) => {
              expect(member).toMatchObject({
                id: expect.any(Number),
                username: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                birthdate: expect.any(String),
                email: expect.any(String),
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

      it('should return partial members, even if limit is 0', async () => {
        await request(app.getHttpServer())
          .get(`/members?limit=0`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect((res) => {
            res.body.data.forEach((member) => {
              expect(member).toMatchObject({
                id: expect.any(Number),
                username: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                birthdate: expect.any(String),
                email: expect.any(String),
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

    describe('GetMember', () => {
      it('should return a member', async () => {
        await request(app.getHttpServer())
          .get(`/members/id/1`)
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
          });
      });

      it('should return a member', async () => {
        await request(app.getHttpServer())
          .get(`/members/username/dnguyen1`)
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
          });
      });

      it('should return NOT_FOUND for accessing member with invalid id, out of range', async () => {
        await request(app.getHttpServer())
          .get(`/members/id/99999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return BAD_REQUEST for accessing member with invalid id, wrong data type', async () => {
        await request(app.getHttpServer())
          .get(`/members/id/badId`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should return NOT_FOUND for accessing member with invalid username, unknown value', async () => {
        await request(app.getHttpServer())
          .get(`/members/username/asdfjadsfjasjf`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('PUT', () => {
    describe('UpdateMember', () => {
      it('should update and return member, name', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            firstName: 'Kalshi',
            lastName: 'Lockon',
          })
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

            expect(res.body.data.firstName).toBe('Kalshi');
            expect(res.body.data.lastName).toBe('Lockon');
          });
      });

      it('should not update, throw bad request, name: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            firstName: 100_000,
            lastName: 100_000,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should update and return member, password', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/3`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            password: '!VOhtro92182',
          })
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
          });
      });

      it('should not update, throw bad request, password: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            password: 'YesThisIsNotEnough',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should update and return member, birthdate', async () => {
        const now = new Date();

        await request(app.getHttpServer())
          .put(`/members/id/3`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            birthdate: now,
          })
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

            expect(res.body.data.birthdate.split('T')[0]).toBe(
              now.toISOString().split('T')[0],
            );
          });
      });

      it('should not update, throw bad request, birthdate: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            birthdate: '28931293819',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should update and return member, email', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/3`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            email: 'this.is.good@gmail.com',
          })
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

            expect(res.body.data.email).toBe('this.is.good@gmail.com');
          });
      });

      it('should not update, throw bad request, email: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            email: '2837uuirjasfjj;sdfjl;k',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should update and return member, phone', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/3`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            phone: '+84 0913290717',
          })
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

            expect(res.body.data.email).toBe('this.is.good@gmail.com');
          });
      });

      it('should not update, throw bad request, phone: bad data', async () => {
        await request(app.getHttpServer())
          .put(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            phone: 913290717,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('POST', () => {
    describe('CreateMember', () => {
      it('should create and return member', async () => {
        await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 'novaids123',
            password: '@Nova010201',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: new Date(),
            email: 'nova.control@djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.CREATED)
          .expect((res) => {
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              username: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              birthdate: expect.any(String),
              email: expect.any(String),
            });
          });
      });

      it('should not create member, username: unique constraint violation', async () => {
        await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 'novaids123',
            password: '@Nova010201',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: new Date(),
            email: 'nova.control@djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should not create member, username: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 121231231231,
            password: '@Nova010201',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: new Date(),
            email: 'nova.control@djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create member, password: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 'novaaids291928',
            password: 'Nova010201fr',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: new Date(),
            email: 'nova.control@djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create member, birthdate: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 'novaaids291928',
            password: '!Nova010201fr',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: 'This is a bad date',
            email: 'nova.control@djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should not create member, email: bad data', async () => {
        await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 'novaaids291928',
            password: '!Nova010201fr',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: new Date(),
            email: 'nova.control!djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('DELETE', () => {
    describe('DeleteMember', () => {
      it('should create and then delete a member', async () => {
        const newMember = await request(app.getHttpServer())
          .post(`/members/`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            username: 'novaaids291928',
            password: '!Nova010201fr',
            firstName: 'Nova',
            lastName: 'Controller',
            birthdate: new Date(),
            email: 'nova.control@djcuck.com',
            phone: null,
            address: null,
          })
          .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
          .delete(`/members/id/${newMember.body.data.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NO_CONTENT);
      });

      it('should not delete a member, bad id: member cannot be found', async () => {
        await request(app.getHttpServer())
          .delete(`/members/id/999999`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should not delete a member, auth: cannot self-delete', async () => {
        await request(app.getHttpServer())
          .delete(`/members/id/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
});
