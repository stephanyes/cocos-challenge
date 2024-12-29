import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';

async function bootstrap() {
  const { server, swagger, project } = config();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.flushLogs();

  app.setGlobalPrefix(`${server.context}`);
  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('class-transformer'),
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());

  if (server.corsEnabled) {
    app.enableCors({
      origin: server.origins,
      allowedHeaders: `${server.allowedHeaders}`,
      methods: `${server.allowedMethods}`,
      credentials: server.corsCredentials,
    });
  }

  if (swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(`${project.name}`)
      .setDescription(`${project.description}`)
      .setVersion(`${project.version}`)
      .setExternalDoc('Cocos Capital', `${project.documentation}`)
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${swagger.path}`, app, documentFactory);
  }

  await app.listen(server.port, () => {
    // `App running on: http://localhost:${server.port}`
    console.log(
      process.env.NODE_ENV !== 'production'
        ? `App running on: http://localhost:${server.port}`
        : `App running as PRODUCTION.`,
    );
  });
}
bootstrap();
