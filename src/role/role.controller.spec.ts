import request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../exceptions/global.exception-filter';
import { PrismaService } from '../prisma/prisma.service';
import { WrappersInterceptor } from '../wrappers/wrappers.interceptor';

describe('RoleController (e2e)', () => {
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
      .get('/roles')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return all roles', async () => {
    await request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toBeDefined();

        res.body.data.forEach((element) => {
          expect(element).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
          });
        });

        expect(res.body.meta).toBeDefined();
      });
  });

  it('should return a role by id', async () => {
    await request(app.getHttpServer())
      .get('/roles/1')
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

  it('should return 400 for an invalid role id', async () => {
    await request(app.getHttpServer())
      .get('/roles/test')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 404 when role id does not exist', async () => {
    await request(app.getHttpServer())
      .get('/roles/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should update a role', async () => {
    await request(app.getHttpServer())
      .put('/roles/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Role',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.name).toBe('Updated Role');
      });
  });

  it('should create a role', async () => {
    await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Role',
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data.name).toBe('Test Role');
      });
  });

  it('should return 400 when creating a role with invalid data', async () => {
    await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should delete a role', async () => {
    await request(app.getHttpServer())
      .delete('/roles/4')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 after the role has been deleted', async () => {
    await request(app.getHttpServer())
      .get('/roles/4')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 404 when deleting a non-existent role', async () => {
    await request(app.getHttpServer())
      .delete('/roles/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return role permissions', async () => {
    await request(app.getHttpServer())
      .get('/roles/1/permissions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('should return 400 when getting permissions with invalid role id', async () => {
    await request(app.getHttpServer())
      .get('/roles/test/permissions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.BAD_REQUEST);
  });
});
