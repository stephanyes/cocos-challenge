import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

const PORT = 3000
async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {bufferLogs: true}
  );
  app.flushLogs();



  // TODO hace algo como if swagger.enabled { TODO LO DE ABAJO }
  const config = new DocumentBuilder()
    .setTitle('Cocos Challenge')
    .setDescription('API REST | Cocos')
    .setVersion('1.0')
    .setExternalDoc("Documentacion externa", "")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);


  app.use(cookieParser());
  await app.listen(PORT, () => {
    // `App running on: http://localhost:${server.port}`
    console.log(
      process.env.NODE_ENV !== 'production'
        ? `App running on: http://localhost:${PORT}`
        : `App running as PRODUCTION.`,
    );
  });
}
bootstrap();
