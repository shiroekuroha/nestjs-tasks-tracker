import request, { Response } from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { createTestApp } from '../../test/test.app';

describe('TaskGroupController (e2e)', () => {
  let app: INestApplication;
  let accessToken = '';

  const taskGroupMatcher = {
    id: expect.any(Number),
    name: expect.any(String),
    color: expect.any(String),
    position: expect.any(Number),
    projectId: expect.any(Number),
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
    describe('GetTaskGroups', () => {
      it('should return all taskGroups', async () => {
        // * Arrange
        const route = `/taskGroups`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial taskGroups, changed limit', async () => {
        // * Arrange
        const route = `/taskGroups?limit=1`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial taskGroups, even if limit is higher than total', async () => {
        // * Arrange
        const route = `/taskGroups?limit=999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial taskGroups, even if limit is 0', async () => {
        // * Arrange
        const route = `/taskGroups?limit=0`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial taskGroups, changed page', async () => {
        // * Arrange
        const route = `/taskGroups?limit=1&page=2`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial taskGroups, even if page is higher than total', async () => {
        // * Arrange
        const route = `/taskGroups?limit=1&page=999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial taskGroups, even if page is 0', async () => {
        // * Arrange
        const route = `/taskGroups?limit=1&page=0`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((taskGroup) => {
          expect(taskGroup).toMatchObject(taskGroupMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });
    });

    describe('GetTaskGroup', () => {
      it('should return a taskGroup', async () => {
        // * Arrange
        const route = `/taskGroups/1`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(taskGroupMatcher);
      });

      it('should return NOT_FOUND for accessing taskGroup with invalid id, out of range', async () => {
        // * Arrange
        const route = `/taskGroups/999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should return BAD_REQUEST for accessing taskGroup with invalid id, wrong data type', async () => {
        // * Arrange
        const route = `/taskGroups/BadId`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PUT', () => {
    describe('UpdateTaskGroup', () => {
      it('should update and return taskGroup, name', async () => {
        // * Arrange
        const route = `/taskGroups/2`;
        const data = {
          name: 'Week 999',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data.name).toBe(data.name);
      });

      it('should update and return taskGroup, color', async () => {
        // * Arrange
        const route = `/taskGroups/2`;
        const data = {
          color: '#a3a33d',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data.color).toBe(data.color);
      });

      it('should not update, throw bad request, name: bad data', async () => {
        // * Arrange
        const route = `/taskGroups/2`;
        const data = {
          name: 999999,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, throw bad request, name: unique constraint violation', async () => {
        // * Arrange
        const route = `/taskGroups/2`;
        const data = {
          name: 'Week 1',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update and return taskGroup, color: bad data', async () => {
        // * Arrange
        const route = `/taskGroups/2`;
        const data = {
          color: 'ThisIsABadColor',
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
    describe('CreateTaskGroup', () => {
      it('should create a taskGroup', async () => {
        // * Arrange
        const route = `/taskGroups/1`;
        const data = {
          name: 'Extras',
          color: '#a81892',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.CREATED);
        expect(result.body.data).toMatchObject(taskGroupMatcher);
      });

      it('should not create a taskGroup, bad name: bad data', async () => {
        // * Arrange
        const route = `/taskGroups/1`;
        const data = {
          name: 999999,
          color: '#a81892',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create a taskGroup, bad name: unique constraint violation', async () => {
        // * Arrange
        const route = `/taskGroups/1`;
        const data = {
          name: 'Week 1',
          color: '#a81892',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create a taskGroup, bad color', async () => {
        // * Arrange
        const route = `/taskGroups/1`;
        const data = {
          name: 'Extras 2',
          color: 'ThisIsABadColor',
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
    describe('DeleteTaskGroup', () => {
      it('should create and then delete a taskGroup', async () => {
        // * Arrange
        const route = `/taskGroups`;
        const data = {
          name: 'Extras 3',
          color: '#a81892',
        };

        // * Act
        const create_result: Response = await request(app.getHttpServer())
          .post(`${route}/1`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        const delete_result: Response = await request(app.getHttpServer())
          .delete(`${route}/${create_result.body.data.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send();

        // * Assert
        expect(create_result.status).toBe(HttpStatus.CREATED);
        expect(delete_result.status).toBe(HttpStatus.NO_CONTENT);
      });

      it('should not delete a taskGroup, bad id: no permission to delete', async () => {
        // * Arrange
        const route = `/taskGroups/999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .delete(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send();

        // * Assert
        expect(result.status).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
