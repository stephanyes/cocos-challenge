import { registerAs } from '@nestjs/config';
import * as PACKAGE_JSON from '../../package.json';
import { User, Instrument, MarketData, Order } from '../entities/index';

export default registerAs('config', () => {
  return {
    project: {
      name: PACKAGE_JSON.name,
      version: PACKAGE_JSON.version,
      description: PACKAGE_JSON.description,
      documentation: PACKAGE_JSON.homepage,
    },
    server: {
      isProd: process.env.NODE_ENV === 'production',
      port: parseInt(process.env.PORT, 10) || 8080,
      context: process.env.CONTEXT,
      origins: process.env.ORIGINS.split(','),
      allowedHeaders: process.env.ALLOWED_HEADERS,
      allowedMethods: process.env.ALLOWED_METHODS,
      corsEnabled: process.env.CORS_ENABLED.toLowerCase() === 'true',
      corsCredentials: process.env.CORS_CREDENTIALS.toLowerCase() === 'true',
    },
    swagger: {
      path: process.env.SWAGGER_PATH,
      enabled: process.env.SWAGGER_ENABLED.toLocaleLowerCase() === 'true',
    },
    database: {
      type: 'postgres' as const,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      entities: [User, Instrument, Order, MarketData],
    }
  };
});
