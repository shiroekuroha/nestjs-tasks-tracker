import request, { Response } from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { createTestApp } from '../../test/test.app';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let accessToken = '';

  const taskMatcher = {
    id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
    position: expect.any(Number),
    status: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    taskGroupId: expect.any(Number),
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
    describe('GetTasks', () => {
      it('should return all tasks', async () => {
        // * Arrange
        const route = `/tasks`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial tasks, changed limit', async () => {
        // * Arrange
        const route = `/tasks?limit=1`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial tasks, even if limit is higher than total', async () => {
        // * Arrange
        const route = `/tasks?limit=999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial tasks, even if limit is 0', async () => {
        // * Arrange
        const route = `/tasks?limit=0`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial tasks, changed page', async () => {
        // * Arrange
        const route = `/tasks?limit=1&page=2`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial tasks, even if page is higher than total', async () => {
        // * Arrange
        const route = `/tasks?limit=1&page=999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });

      it('should return partial tasks, even if page is 0', async () => {
        // * Arrange
        const route = `/tasks?limit=1&page=0`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);

        result.body.data.forEach((task) => {
          expect(task).toMatchObject(taskMatcher);
        });

        expect(result.body.meta).toMatchObject(paginationMatcher);
      });
    });

    describe('GetTask', () => {
      it('should return a task', async () => {
        // * Arrange
        const route = `/tasks/1`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(taskMatcher);

        expect(
          result.body.data.startDate == null ||
            typeof result.body.data.startDate == 'string',
        ).toBe(true);

        expect(
          result.body.data.dueDate == null ||
            typeof result.body.data.dueDate == 'string',
        ).toBe(true);
      });

      it('should return NOT_FOUND for accessing task with invalid id, out of range', async () => {
        // * Arrange
        const route = `/tasks/999999`;
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .get(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should return BAD_REQUEST for accessing task with invalid id, wrong data type', async () => {
        // * Arrange
        const route = `/tasks/BadId`;
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
    describe('UpdateTask', () => {
      it('should update and return a task, name', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          name: 'Unique Task Name 1',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(taskMatcher);
      });

      it('should update and return a task, description', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          name: 'General Task Description',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(taskMatcher);
      });

      it('should update and return a task, status', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          status: 'DONE',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(taskMatcher);
      });

      it('should update and return a task, startDate/dueDate', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          startDate: new Date(),
          dueDate: new Date(),
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.OK);
        expect(result.body.data).toMatchObject(taskMatcher);
      });

      it('should not update, name: unique constraint violation', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          name: 'Make Coffee',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, name: bad data', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          name: 999_999,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, description: bad data', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          desc: 999_999,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, status: bad data', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          status: 'WRONG',
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .put(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not update, startDate/dueDate: bad data', async () => {
        // * Arrange
        const route = `/tasks/2`;
        const data = {
          startDate: 'NotADate',
          dueDate: 'NotADate',
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
    describe('CreateTask', () => {
      it('should create and return a task', async () => {
        // * Arrange
        const route = `/tasks/1`;
        const data = {
          name: 'New Task 100',
          description: 'This is just a description',
          status: 'TODO',
          startDate: null,
          dueDate: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.CREATED);
        expect(result.body.data).toMatchObject(taskMatcher);

        expect(
          result.body.data.startDate == null ||
            typeof result.body.data.startDate == 'string',
        ).toBe(true);

        expect(
          result.body.data.dueDate == null ||
            typeof result.body.data.dueDate == 'string',
        ).toBe(true);
      });

      it('should not create a task, name: unique constraint violation', async () => {
        // * Arrange
        const route = `/tasks/1`;
        const data = {
          name: 'New Task 100',
          description: 'This is just a description',
          status: 'TODO',
          startDate: null,
          dueDate: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, name: bad data', async () => {
        // * Arrange
        const route = `/tasks/1`;
        const data = {
          name: 999_999,
          description: 'This is just a description',
          status: 'TODO',
          startDate: null,
          dueDate: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, description: bad data', async () => {
        await request(app.getHttpServer());
        // * Arrange
        const route = `/tasks/1`;
        const data = {
          name: 'New Task 101',
          description: 999_999,
          status: 'TODO',
          startDate: null,
          dueDate: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, status: bad data', async () => {
        // * Arrange
        const route = `/tasks/1`;
        const data = {
          name: 'New Task 101',
          description: 'This is just a description',
          status: 'TODOs',
          startDate: null,
          dueDate: null,
        };

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should not create a task, startDate/dueDate: bad data', async () => {
        // * Arrange
        const route = `/tasks/1`;
        const data = {
          name: 'New Task 101',
          description: 'This is just a description',
          status: 'TODO',
          startDate: 'BadDate',
          dueDate: 'BadDate',
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
    describe('DeleteTask', () => {
      it('should create and then delete a task', async () => {
        // * Arrange
        const route = `/tasks`;
        const data = {
          name: 'New Task 101',
          description: 'This is just a description',
          status: 'TODO',
          startDate: null,
          dueDate: null,
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

      it('should not delete a task, bad id: no permission to delete', async () => {
        // * Arrange
        const route = '/tasks/999999';
        const data = {};

        // * Act
        const result: Response = await request(app.getHttpServer())
          .post(route)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(data);

        // * Assert
        expect(result.status).toBe(HttpStatus.FORBIDDEN);
      });
    });
  });
});
