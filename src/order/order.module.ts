import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { User, Order, Instrument, MarketData } from 'src/entities';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Instrument, MarketData])],
  providers: [AppService, OrderService],
  exports: [TypeOrmModule],
  controllers: [OrderController],
})
export class OrderModule {}
