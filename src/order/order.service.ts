import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create.dto';
import { User, Instrument, Order, MarketData } from '../entities';
import {
  ARS_CODE,
  CASH_IN_PRICE,
  CASH_OUT_PRICE,
} from '../constants/constants';
import { checkFundsOrShares, getLastClosePrice } from '../utils/utils';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,

    @InjectRepository(MarketData)
    private readonly marketdataRepository: Repository<MarketData>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'instrument'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'instrument'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async createNewOrder(dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userid },
    });
    if (!user) throw new NotFoundException('User not found');

    // CASH_IN / CASH_OUT case
    if (dto.side === 'CASH_IN' || dto.side === 'CASH_OUT') {
      const cashInstrument = await this.instrumentRepository.findOne({
        where: { id: ARS_CODE },
      });
      if (!cashInstrument) {
        throw new NotFoundException(
          `Cash instrument not found (ID=${ARS_CODE})`,
        );
      }

      // Creamos la orden usando el instrumento ARS de la DB
      const newOrder = this.orderRepository.create({
        user,
        instrument: cashInstrument,
        side: dto.side,
        size: dto.size,
        type: dto.type,
        datetime: new Date(),
      });

      if (dto.side === 'CASH_IN') {
        newOrder.price = CASH_IN_PRICE;
        newOrder.status = 'FILLED';
        return this.orderRepository.save(newOrder);
      } else {
        // Se valida que el usuario tenga fondos para hacer CASH_OUT
        const canWithdraw = await checkFundsOrShares(
          user.id,
          cashInstrument.id,
          dto.side,
          dto.size,
          CASH_OUT_PRICE,
          this.orderRepository,
        );
        if (!canWithdraw) {
          newOrder.status = 'REJECTED';
          return this.orderRepository.save(newOrder);
        }
        newOrder.price = CASH_OUT_PRICE;
        newOrder.status = 'FILLED';
        return this.orderRepository.save(newOrder);
      }
    }

    // Verificar instrumento para BUY o SELL (casos MARKET y LIMIT)
    const instrument = await this.instrumentRepository.findOne({
      where: { id: dto.instrumentid },
    });
    if (!instrument) throw new NotFoundException('Instrument not found');

    const newOrder = this.orderRepository.create({
      user,
      instrument,
      side: dto.side,
      size: dto.size,
      type: dto.type,
      datetime: new Date(),
    });

    // MARKET
    if (dto.type === 'MARKET') {
      const marketPrice =
        dto.price ??
        (await getLastClosePrice(instrument.id, this.marketdataRepository));
      newOrder.price = marketPrice;

      // Validar fondos o acciones
      const isValid = await checkFundsOrShares(
        user.id,
        instrument.id,
        dto.side,
        dto.size,
        marketPrice,
        this.orderRepository,
      );
      if (!isValid) {
        newOrder.status = 'REJECTED';
        return this.orderRepository.save(newOrder);
      }
      newOrder.status = 'FILLED';

      // LIMIT
    } else if (dto.type === 'LIMIT') {
      if (!dto.price) {
        newOrder.status = 'REJECTED';
        return this.orderRepository.save(newOrder);
      }
      newOrder.price = dto.price;

      const isValid = await checkFundsOrShares(
        user.id,
        instrument.id,
        dto.side,
        dto.size,
        dto.price,
        this.orderRepository,
      );
      newOrder.status = isValid ? 'NEW' : 'REJECTED';
    }
    return this.orderRepository.save(newOrder);
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, orderData);
    const updatedOrder = await this.findOne(id);
    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.orderRepository.delete(id);
  }
  /**
   *  SELECT o.*, u.email, i.ticker, i.name
   *    FROM orders o
   *    JOIN users u ON o.userid = u.id
   *    JOIN instruments i ON o.instrumentid = i.id
   *    WHERE o.userid = 1; 
   */
  findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'instrument'],
    });
  }

  /**
   * SELECT o.*, u.email, i.ticker, i.name
   *  FROM orders o
   *  JOIN users u ON o.userid = u.id
   *  JOIN instruments i ON o.instrumentid = i.id
   *  WHERE o.status = 'FILLED'; 
   */
  findByStatus(status: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status },
      relations: ['user', 'instrument'],
    });
  }

  /**
   * SELECT o.*, u.email, i.ticker, i.name
   *  FROM orders o
   *  JOIN users u ON o.userid = u.id
   *  JOIN instruments i ON o.instrumentid = i.id
   *  WHERE o.instrumentid = 31; 
   */
  findByInstrument(instrumentId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { instrument: { id: instrumentId } },
      relations: ['user', 'instrument'],
    });
  }
}
