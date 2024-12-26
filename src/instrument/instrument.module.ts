import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { User, Order, Instrument } from 'src/entities';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Order, Instrument])],
    providers: [AppService, InstrumentService],
    exports: [TypeOrmModule],
    controllers: [InstrumentController],
  })
export class InstrumentModule {}
