import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Instrument, MarketData, Order } from './entities/index'
import { UsersModule } from './user/user.module';
import { InstrumentModule } from './instrument/instrument.module';
import { OrderModule } from './order/order.module';
import { MarketDataModule } from './market/market.module';
import { UserService } from './user/user.service';
import { OrderService } from './order/order.service';
import { InstrumentService } from './instrument/instrument.service';
import { MarketService } from './market/market.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'stampy.db.elephantsql.com',
      port: 5432,
      username: 'yhreyqhg',
      password: 'N8b4UaLKOWaokFcD6elNBVfkgYGh_JZU',
      database: 'yhreyqhg',
      entities: [User, Instrument, MarketData, Order],
      synchronize: false,
    }),
    OrderModule,
    UsersModule,
    InstrumentModule,
    MarketDataModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, OrderService, InstrumentService, MarketService],
})
export class AppModule {}
