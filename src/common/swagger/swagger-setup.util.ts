import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envConfig } from 'src/config/envs';
import basicAuth from 'express-basic-auth';

export const setupSwagger = (app: INestApplication) => {
  if (envConfig.NODE_ENV !== 'development') {
    //añade una contraseña para acceder a la documentación cuando no es en development, utilizando express
    app.use(
      [envConfig.SWAGGER_PATH, `${envConfig.SWAGGER_PATH}-json`],
      basicAuth({
        challenge: true,
        users: {
          admin: envConfig.SWAGGER_PASSWORD
        }
      })
    );
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Full Salud API')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(envConfig.SWAGGER_PATH, app, swaggerDocument);
};
