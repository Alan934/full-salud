import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './envs';

export const cloundinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: envConfig.CLOUDINARY_NAME,
      api_key: envConfig.CLOUDINARY_API_KEY,
      api_secret: envConfig.CLOUDINARY_API_SECRET
    });
  }
};
