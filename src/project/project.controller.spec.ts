import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    dotenv.config({ path: '.env.test' });

    execSync('npx prisma migrate reset --force --skip-generate --skip-seed', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be empty', async () => {
    await request(app.getHttpServer()).get('/projects').send({}).expect(200);
  });
});
