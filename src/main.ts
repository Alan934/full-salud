import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger/swagger-setup.util';

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
      forbidNonWhitelisted: true
    })
  );

  app.setGlobalPrefix('api');

  // Configurar Swagger con autenticación básica en producción
  if (envConfig.NODE_ENV === 'production') {
    setupSwagger(app); // Llama a setupSwagger con autenticación en producción
  } else {
    // Configuración de Swagger sin autenticación en otros entornos
    setupSwagger(app, false);
  }

  const port = envConfig.PORT;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { envConfig } from './config/envs';
// import { ValidationPipe } from '@nestjs/common';
// import { setupSwagger } from './common/swagger/swagger-setup.util';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Habilitar CORS
//   app.enableCors({
//     origin: '*',
//     methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//     credentials: true, 
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true
//     })
//   );

//   app.setGlobalPrefix('api');

//   // Configurar Swagger con autenticación básica en producción
//   if (process.env.NODE_ENV === 'production') {
//     setupSwagger(app); // Llama a setupSwagger directamente en producción
//   } else {
//     // Configuración de Swagger sin autenticación en otros entornos
//     setupSwagger(app, false);
//   }

//   const port = envConfig.PORT;
//   await app.listen(port);
//   console.log(`Server running on http://localhost:${port}`);
// }
// bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { envConfig } from './config/envs';
// import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import basicAuth from 'express-basic-auth';
// //import { setupSwagger } from './common/swagger/swagger-setup.util';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Habilitar CORS
//   app.enableCors({
//     origin: '*',
//     methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//     credentials: true, 
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true
//     })
//   );

//   app.setGlobalPrefix('api');

//   //setupSwagger(app);

//   if (envConfig.NODE_ENV !== 'development') {
//     //añade una contraseña para acceder a la documentación cuando no es en development, utilizando express
//     app.use(
//       [envConfig.SWAGGER_PATH, `${envConfig.SWAGGER_PATH}-json`],
//       basicAuth({
//         challenge: true,
//         users: {
//           admin: envConfig.SWAGGER_PASSWORD
//         }
//       })
//     );
//   }

//   const config = new DocumentBuilder()
//   .setTitle('Full Salud API')
//   .setDescription('')
//   .setVersion('1.0')
//   .build();

//   const document = SwaggerModule.createDocument(app, config);

//   SwaggerModule.setup('api/docs', app, document, {
//     customSiteTitle: 'Backend Generator',
//     customfavIcon: 'https://avatars.githubusercontent.com/u/185267919?s=400&u=7d74f9c123b27391d3f11da2815de1e9a1031ca9&v=4',
//     customJs: [
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
//     ],
//     customCssUrl: [
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
//       'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
//     ],
//   });

//   const port = envConfig.PORT;

//   await app.listen(port);
//   console.log(`Server running on http://localhost:${port}`);
// }
// bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { envConfig } from './config/envs';
// import { ValidationPipe } from '@nestjs/common';
// import { setupSwagger } from './common/swagger/swagger-setup.util';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//      // Habilitar CORS
//   app.enableCors({
//       origin: 'http://api-full-salud.vercel.app', // Cambia esto por el dominio de tu frontend
//       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//       credentials: true,
//   });
  
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true
//     })
//   );

//   // Agrega el prefijo para todas las rutas
//   app.setGlobalPrefix('api');

//   if (process.env.NODE_ENV === 'production') {
//     setupSwagger(app);
//   }

//   const port = process.env.PORT || envConfig.PORT || 3000;
//   await app.listen(port, '0.0.0.0'); // Escucha en todas las interfaces
//   console.log(`Server running on http://localhost:${port}/api`);
// }

// bootstrap();
