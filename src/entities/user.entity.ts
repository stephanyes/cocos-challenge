import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email del user' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Numero de cuenta del usuario' })
  @Column()
  accountnumber: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
