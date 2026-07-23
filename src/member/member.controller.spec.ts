import request, { Response } from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { createTestApp } from '../../test/test.app';

describe('MemberController (e2e)', () => {
  let app: INestApplication;
  let accessToken = '';

  const memberMatcher = {
    id: expect.any(Number),
    username: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
    birthdate: expect.any(String),
    email: expect.any(String),
  };

  const paginationMatcher = {
    page: expect.any(Number),
    item: expect.any(Number),
    total_pages: expect.any(Number),
    total_items: expect.any(Number),
  };

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    accessToken = context.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET', () => {
    describe('GetMembers', () => {
      it('should return all members', async () => {
        // * Arrange
        const route = `/members`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial members, changed limit', async () => {
        // * Arrange
        const route = `/members?limit=2`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial members, even if limit is higher than total', async () => {
        // * Arrange
        const route = `/members?limit=100`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial members, even if limit is 0', async () => {
        // * Arrange
        const route = '/members?limit=0';
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial members, changed page', async () => {
        // * Arrange
        const route = '/members?limit=1&page=2';
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial members, even if page is higher than total', async () => {
        // * Arrange
        const route = '/members?limit=1&page=999999';
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial members, even if page is 0', async () => {
        // * Arrange
        const route = '/members?limit=1&page=0';
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((member) => {
          expect(member).toMatchObject(memberMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });
    });

    describe('GetMember', () => {
      it('should return a member', async () => {
        // * Arrange
        const route = '/members/id/1';
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(memberMatcher);
      });
    });

    it('should return a member', async () => {
      // * Arrange
      const route = '/members/username/dnguyen1';
      const data = {};

      // * Act
      const result: Response = await request(app.getHttpServer())
        .get(route)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

      // * Assert
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.body.data).toMatchObject(memberMatcher);
    });

    it('should return NOT_FOUND for accessing member with invalid id, out of range', async () => {
      // * Arrange
      const route = '/members/id/999999';
      const data = {};

      // * Act
      const result: Response = await request(app.getHttpServer())
        .get(route)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

      // * Assert
      expect(result.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return BAD_REQUEST for accessing member with invalid id, wrong data type', async () => {
      // * Arrange
      const route = '/members/id/ThisIsNotAValidId';
      const data = {};

      // * Act
      const result: Response = await request(app.getHttpServer())
        .get(route)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

      // * Assert
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return NOT_FOUND for accessing member with invalid username, unknown value', async () => {
      // * Arrange
      const route = '/members/username/ThisIsNotAValidUsername';
      const data = {};

      // * Act
      const result: Response = await request(app.getHttpServer())
        .get(route)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

      // * Assert
      expect(result.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT', () => {
    describe('UpdateMember', () => {
      it('should update and return member, name', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          firstName: 'Endra',
          lastName: 'Veil',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(memberMatcher);
        expect(result.body.data.firstName).toBe(data.firstName);
        expect(result.body.data.lastName).toBe(data.lastName);
      });

      it('should update and return member, password', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          password: '*ThisIsNewPW2026',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(memberMatcher);
      });

      it('should update and return member, birthdate', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          birthdate: new Date(),
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(memberMatcher);
        expect(result.body.data.birthdate.split('T')[0]).toBe(
          data.birthdate.toISOString().split('T')[0],
        );
      });

      it('should update and return member, email', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          email: 'good.smile@gmail.com',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(memberMatcher);
        expect(result.body.data.email).toBe(data.email);
      });

      it('should update and return member, phone', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          phone: '+84 0843291999',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(memberMatcher);
        expect(result.body.data.phone).toBe(data.phone);
      });

      it('should not update, throw bad request, name: bad data', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          firstName: 999_999,
          lastName: 999_999,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, throw bad request, password: bad data', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          password: 'ThisIsNewPW2026',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, throw bad request, birthdate: bad data', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          birthdate: 'NotAValidDate',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, throw bad request, email: bad data', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          email: 'ThisIsNotAGoodEmail',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, throw bad request, phone: bad data', async () => {
        // * Arrange
        const route = '/members/id/2';
        const data = {
          phone: 'ThisIsNotAGoodPhone',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('POST', () => {
    describe('CreateMember', () => {
      it('should create and return member', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 'novaids123',
          password: '@Nova010201',
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: new Date(),
          email: 'nova.control@djcuck.com',
          phone: null,
          address: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.CREATED);
        expect(result.body.data).toMatchObject(memberMatcher);
      });

      it('should not create member, username: unique constraint violation', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 'novaids123',
          password: '@Nova010201',
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: new Date(),
          email: 'nova.control@djcuck.com',
          phone: null,
          address: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.FORBIDDEN);
      });

      it('should not create member, username: bad data', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 999_999,
          password: '@Nova010201',
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: new Date(),
          email: 'nova.control@djcuck.com',
          phone: null,
          address: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create member, password: bad data', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 'novaids1234',
          password: 999_999,
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: new Date(),
          email: 'nova.control@djcuck.com',
          phone: null,
          address: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create member, birthdate: bad data', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 'novaids1234',
          password: '@Nova010201',
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: 'NotARealBirthdate',
          email: 'nova.control@djcuck.com',
          phone: null,
          address: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create member, email: bad data', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 'novaids1234',
          password: '@Nova010201',
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: new Date(),
          email: 'NotARealEmail',
          phone: null,
          address: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('DELETE', () => {
    describe('DeleteMember', () => {
      it('should create and then delete a member', async () => {
        // * Arrange
        const route = '/members';
        const data = {
          username: 'novaids1234',
          password: '@Nova010201',
          firstName: 'Nova',
          lastName: 'Controller',
          birthdate: new Date(),
          email: 'real.email@probably.org',
          phone: null,
          address: null,
        };

        // * Act
        const create_result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        const delete_result: Response = await request(app.getHttpServer())
          .delete(`${route}/id/${create_result.body.data.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send();

        // * Assert
        expect(create_result.status).toBe(HttpStatus.CREATED);
        expect(delete_result.status).toBe(HttpStatus.NO_CONTENT);
      });

      it('should not delete a member, bad id: member cannot be found', async () => {
        // * Arrange
        const route = `/members/id/999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .delete(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should not delete a member, auth: cannot self-delete', async () => {
        // * Arrange
        const route = `/members/id/1`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .delete(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.FORBIDDEN);
      });
    });
  });
});
