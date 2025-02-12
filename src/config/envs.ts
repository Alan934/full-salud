import 'dotenv/config';
import * as joi from 'joi';

const enVarsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid('development', 'production')
      .default('development'),
    HOST: joi.string().default('localhost'),
    DB_PORT: joi.number().default(3306),
    JWT_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    DB_USERNAME: joi.string().default('root'),
    DB_PASSWORD: joi.string().allow('').default(''),
    DB_NAME: joi.string(),
    CLOUDINARY_NAME: joi.string().allow(),
    CLOUDINARY_API_KEY: joi.number().allow(),
    CLOUDINARY_API_SECRET: joi.string().allow(),
    SWAGGER_PATH: joi.string(),
    SWAGGER_PASSWORD: joi.string(),
    S3_ACCESS_KEY_ID: joi.string().allow(),
    S3_SECRET_ACCESS_KEY: joi.string().allow(),
    S3_REGION: joi.string().allow(),
    S3_BUCKET_NAME: joi.string().allow(),
  })
  .unknown()
  .required(); // unknown() permite que se añadan variables de entorno no definidas en el esquema

const { error, value: envVars } = enVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

//Intertfaz para las varialbes de entorno

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  SWAGGER_PATH: string;
  SWAGGER_PASSWORD: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_REGION: string;
  S3_BUCKET_NAME: string;
}

//Exportamos las envs validadas

export const envConfig: EnvVars = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  HOST: envVars.HOST,
  DB_PORT: envVars.DB_PORT,
  DB_USERNAME: envVars.DB_USERNAME,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_NAME: envVars.DB_NAME,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
  CLOUDINARY_NAME: envVars.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
  SWAGGER_PATH: envVars.SWAGGER_PATH,
  SWAGGER_PASSWORD: envVars.SWAGGER_PASSWORD,
  S3_ACCESS_KEY_ID: envVars.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: envVars.S3_SECRET_ACCESS_KEY,
  S3_REGION: envVars.S3_REGION,
  S3_BUCKET_NAME: envVars.S3_BUCKET_NAME
};




// import 'dotenv/config';
// import * as joi from 'joi';

// // Esquema de validación para las variables de entorno
// const enVarsSchema = joi
//   .object({
//     PORT: joi.number().default(3000), // Puerto por defecto
//     NODE_ENV: joi.string().valid('development', 'production').default('development'),
//     HOST: joi.string().default('localhost'),
//     POSTGRES_URL: joi.string().required(), // Requerido para la conexión a PostgreSQL
//     CLOUDINARY_NAME: joi.string().allow(''),
//     CLOUDINARY_API_KEY: joi.string().allow(''),
//     CLOUDINARY_API_SECRET: joi.string().allow(''),
//     SWAGGER_PATH: joi.string().allow(''),
//     SWAGGER_PASSWORD: joi.string().allow(''),
//     S3_ACCESS_KEY_ID: joi.string().allow(''),
//     S3_SECRET_ACCESS_KEY: joi.string().allow(''),
//     S3_REGION: joi.string().allow(''),
//     S3_BUCKET_NAME: joi.string().allow('')
//   })
//   .unknown()
//   .required();

// // Validación de las variables de entorno
// const { error, value: envVars } = enVarsSchema.validate(process.env);

// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

// // Interfaz para las variables de entorno
// interface EnvVars {
//   PORT: number; // Asegúrate de que el puerto esté configurado correctamente
//   NODE_ENV: string;
//   HOST: string;
//   POSTGRES_URL: string; // Agregado para la URL de PostgreSQL
//   CLOUDINARY_NAME?: string;
//   CLOUDINARY_API_KEY?: string;
//   CLOUDINARY_API_SECRET?: string;
//   SWAGGER_PATH?: string;
//   SWAGGER_PASSWORD?: string;
//   S3_ACCESS_KEY_ID?: string;
//   S3_SECRET_ACCESS_KEY?: string;
//   S3_REGION?: string;
//   S3_BUCKET_NAME?: string;
// }

// // Exportamos las envs validadas
// export const envConfig: EnvVars = {
//   PORT: envVars.PORT, // Exportado para el uso en la aplicación
//   NODE_ENV: envVars.NODE_ENV,
//   HOST: envVars.HOST,
//   POSTGRES_URL: envVars.POSTGRES_URL, // Exportado
//   CLOUDINARY_NAME: envVars.CLOUDINARY_NAME,
//   CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
//   SWAGGER_PATH: envVars.SWAGGER_PATH,
//   SWAGGER_PASSWORD: envVars.SWAGGER_PASSWORD,
//   S3_ACCESS_KEY_ID: envVars.S3_ACCESS_KEY_ID,
//   S3_SECRET_ACCESS_KEY: envVars.S3_SECRET_ACCESS_KEY,
//   S3_REGION: envVars.S3_REGION,
//   S3_BUCKET_NAME: envVars.S3_BUCKET_NAME
// };
