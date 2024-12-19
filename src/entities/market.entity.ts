import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Instrument } from './instrument.entity';

@Entity('marketdata')
export class MarketData {
  @ApiProperty({ description: 'Unique identifier for the market data' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Instrument associated with the market data', type: () => Instrument })
  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @ApiProperty({ description: 'High price for the instrument' })
  @Column('decimal')
  high: number;

  @ApiProperty({ description: 'Low price for the instrument' })
  @Column('decimal')
  low: number;

  @ApiProperty({ description: 'Opening price for the instrument' })
  @Column('decimal')
  open: number;

  @ApiProperty({ description: 'Closing price for the instrument' })
  @Column('decimal')
  close: number;

  @ApiProperty({ description: 'Previous closing price for the instrument' })
  @Column('decimal')
  previousClose: number;

  @ApiProperty({ description: 'Datetime for the market data record' })
  @Column('timestamp')
  datetime: Date;
}
