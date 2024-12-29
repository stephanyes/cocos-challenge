import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { MarketData, User } from 'src/entities';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarketData, User])],
  providers: [AppService, MarketService],
  exports: [TypeOrmModule],
  controllers: [MarketController],
})
export class MarketDataModule {}
