import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email address of the user' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Account number associated with the user' })
  @Column()
  accountnumber: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
