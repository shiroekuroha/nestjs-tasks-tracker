import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AnalyticsInterceptor } from './analytics/analytics.interceptor';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exceptions/global.exception-filter';
import { WrappersInterceptor } from './wrappers/wrappers.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Tasks Tracker')
    .setDescription('The Tasks Tracker API documentations')
    .setVersion('1.0')
    .addTag('Tasks Tracker')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    app.get(AnalyticsInterceptor),
    app.get(WrappersInterceptor),
  );

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  app.enableCors({
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
