import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Unique identifier for the order' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Instrument associated with the order', type: () => Instrument })
  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @ApiProperty({ description: 'User who placed the order', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Side of the order (e.g., buy or sell)' })
  @Column()
  side: string;

  @ApiProperty({ description: 'Size of the order' })
  @Column('decimal')
  size: number;

  @ApiProperty({ description: 'Price of the order' })
  @Column('decimal')
  price: number;

  @ApiProperty({ description: 'Type of the order (e.g., market, limit)' })
  @Column()
  type: string;

  @ApiProperty({ description: 'Status of the order (e.g., pending, completed)' })
  @Column()
  status: string;

  @ApiProperty({ description: 'Datetime when the order was created' })
  @Column('timestamp')
  datetime: Date;
}
