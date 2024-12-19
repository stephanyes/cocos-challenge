import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
}
