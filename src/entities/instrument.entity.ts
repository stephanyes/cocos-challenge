import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MarketData } from './market.entity';
import { Order } from './order.entity';

@Entity('instruments')
export class Instrument {
  @ApiProperty({ description: 'Unique identifier for the instrument' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ticker symbol of the instrument' })
  @Column()
  ticker: string;

  @ApiProperty({ description: 'Name of the instrument' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Type of the instrument (e.g., stock, bond)' })
  @Column()
  type: string;

  @OneToMany(() => Order, (order) => order.instrument)
  orders: Order[];

  @OneToMany(() => MarketData, (marketData) => marketData.instrument)
  marketData: MarketData[];
}
