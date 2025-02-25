import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envConfig } from './envs';

export const databaseProviders: TypeOrmModuleOptions = {
  type: 'postgres',
  // type: 'mysql',
  host: envConfig.HOST,
  port: envConfig.DB_PORT || 3306,
  database: envConfig.DB_NAME,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD || '',
  autoLoadEntities: true, // Carga las entidades automáticamente
  synchronize: true,
  logging: envConfig.NODE_ENV != 'production', // Activa los logs de TypeORM cuando el entrono no es de producción
  ssl: { rejectUnauthorized: false },
};



// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { envConfig } from './envs';

// export const databaseProviders: TypeOrmModuleOptions = {
//   type: 'postgres', // Cambiado a 'postgres' para PostgreSQL
//   url: envConfig.POSTGRES_URL, // Usando la URL de conexión
//   autoLoadEntities: true, // Carga las entidades automáticamente
//   synchronize: envConfig.NODE_ENV !== 'production', // No sincronizar en producción
//   logging: envConfig.NODE_ENV !== 'production', // Activa los logs de TypeORM en desarrollo
//   extra: {
//     ssl: {
//       rejectUnauthorized: false // Configuración SSL para conexiones seguras
//     }
//   }
// };
