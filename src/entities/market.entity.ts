import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument, (instrument) => instrument.marketData)
  @JoinColumn({ name: 'instrumentid' })
  instrument: Instrument;

  @Column({ type: 'float', nullable: false })
  high: number | null;

  @Column({ type: 'float', nullable: false })
  low: number | null;

  @Column()
  open: number;

  @Column()
  close: number;

  @Column()
  previousclose: number;

  @Column()
  date: Date;
}
