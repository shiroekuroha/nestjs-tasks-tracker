import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

export default async () => {
  dotenv.config({
    path: '.env.test',
    override: true,
  });

  execSync('npx prisma migrate reset --force', {
    stdio: 'inherit',
    env: process.env,
  });

  execSync('npx prisma db seed', {
    stdio: 'inherit',
    env: {
      ...process.env,
    },
  });
};
