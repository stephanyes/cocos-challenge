import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  accountNumber: string;
}
