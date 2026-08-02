import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './filters/all-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, DELETE',
    credentials: true,
  });

  await app.listen(process.env.APPLICATION_PORT ?? 3000);
}
bootstrap();
