import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { InstrumentModule } from './instrument/instrument.module';
import { OrderModule } from './order/order.module';
import { MarketDataModule } from './market/market.module';
import { UserService } from './user/user.service';
import { OrderService } from './order/order.service';
import { InstrumentService } from './instrument/instrument.service';
import { MarketService } from './market/market.service';
import { ConfigModule } from '@nestjs/config';
import { config, validationSchema } from './config';
import { PortfolioController } from './portfolio/portfolio.controller';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : '',
      load: [config],
      cache: true,
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot(config().database),
    OrderModule,
    UsersModule,
    InstrumentModule,
    MarketDataModule,
    PortfolioModule,
  ],
  controllers: [AppController, PortfolioController],
  providers: [
    AppService,
    UserService,
    OrderService,
    InstrumentService,
    MarketService,
    PortfolioService,
  ],
})
export class AppModule {}
