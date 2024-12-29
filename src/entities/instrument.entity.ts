import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MarketData } from './market.entity';
import { Order } from './order.entity';

@Entity('instruments')
export class Instrument {
  @ApiProperty({ description: 'Instrument ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ticker symbol [DYCA, MTR, BHIP]' })
  @Column()
  ticker: string;

  @ApiProperty({ description: 'Nombre del instrumento' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Tipo de instrumento [ACCIONES, MONEDA] ' })
  @Column()
  type: string;

  @OneToMany(() => Order, (order) => order.instrument)
  orders: Order[];

  @OneToMany(() => MarketData, (marketData) => marketData.instrument)
  marketData: MarketData[];
}
