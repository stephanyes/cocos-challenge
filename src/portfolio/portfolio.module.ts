import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { User, Order, Instrument, MarketData } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Instrument, MarketData])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
