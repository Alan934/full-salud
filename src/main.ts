import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger/swagger-setup.util';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Configurar para servir archivos estáticos
  const publicPath = join(__dirname, '..', 'public');
  app.use(express.static(publicPath));

  // Middleware para servir index.html en la raíz
  app.use((req, res, next) => {
    if (req.path === '/') {
      res.sendFile(join(publicPath, 'index.html'));
    } else {
      next();
    }
  });

  setupSwagger(app);

  const port = envConfig.PORT;

  await app.listen(port || 3000);
}

bootstrap();