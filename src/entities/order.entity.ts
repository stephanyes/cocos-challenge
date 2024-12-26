import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Instrument } from "./instrument.entity";
import { User } from "./user.entity";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userid' })
  user: User;

  @ManyToOne(() => Instrument, (instrument) => instrument.orders)
  @JoinColumn({ name: 'instrumentid' })
  instrument: Instrument;

  @Column()
  side: string;

  @Column()
  size: number;

  @Column()
  price: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  datetime: Date;
}
