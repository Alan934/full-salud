import { S3Client } from '@aws-sdk/client-s3';
import { envConfig } from './envs';

export const s3Provider = {
  provide: 'S3_CLIENT',
  useFactory: () => {
    return new S3Client({
      region: envConfig.S3_REGION,
      credentials: {
        accessKeyId: envConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: envConfig.S3_SECRET_ACCESS_KEY
      }
    });
  }
};
