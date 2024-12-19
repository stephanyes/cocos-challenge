import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingService } from './logging/logging.service';
import { LoggingModule } from './logging/logging.module';
import { HttpService } from './http/http.service';
import { HttpModule } from './http/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    LoggingModule, 
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'stampy.db.elephantsql.com',
      port: 5432,
      username: 'yhreyqhg',
      password: 'N8b4UaLKOWaokFcD6elNBVfkgYGh_JZU',
      database: 'yhreyqhg',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LoggingService, HttpService],
})
export class AppModule {}
