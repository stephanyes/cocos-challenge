import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, Order, Instrument, MarketData } from '../entities';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,

    @InjectRepository(MarketData)
    private readonly marketDataRepository: Repository<MarketData>,
  ) {}

  async getPortfolio(userId: number) {
    // Verificar que el usuario exista
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Obtener órdenes FILLED del usuario (solo las que impactan en el balance/posiciones)
    /**
     * SELECT o.*, i.*
     * FROM orders o
     * JOIN instruments i
     *   ON o.instrumentid = i.id
     * WHERE o.userid = 1
     *   AND o.status = 'FILLED';
     */
    const filledOrders = await this.orderRepository.find({
      where: { user: { id: user.id }, status: 'FILLED' },
      relations: ['instrument'],
      order: { datetime: 'ASC' },
    });

    // Calcular los pesos disponibles (a partir de CASH_IN, CASH_OUT, BUY, SELL)
    let availableFunds = 0;
    // Suponemos el usuario arranca en 0 pesos y va sumando/restando según órdenes FILLED
    for (const order of filledOrders) {
      if (order.side === 'CASH_IN') {
        availableFunds += order.size;
      } else if (order.side === 'CASH_OUT') {
        availableFunds -= order.size;
      } else if (order.side === 'BUY') {
        availableFunds -= order.size * order.price; // size * price => monto gastado
      } else if (order.side === 'SELL') {
        availableFunds += order.size * order.price; // size * price => monto recibido
      }
    }

    // Calcular la posición neta de cada instrumento (solo BUY y SELL)
    const netPositions = new Map<number, number>(); // instrumentId => cantidad neta
    for (const order of filledOrders) {
      if (order.side === 'BUY') {
        netPositions.set(
          order.instrument.id,
          (netPositions.get(order.instrument.id) ?? 0) + order.size,
        );
      } else if (order.side === 'SELL') {
        netPositions.set(
          order.instrument.id,
          (netPositions.get(order.instrument.id) ?? 0) - order.size,
        );
      }
    }

    // Obtener datos de mercado (close, previousClose) para cada instrumento en el que haya posición
    const instrumentIds = Array.from(netPositions.keys()).filter((id) => {
      const cantidad = netPositions.get(id);
      return cantidad && cantidad !== 0; // Solo interesa si la posición neta es != 0
    });

    let instruments: Instrument[] = [];
    if (instrumentIds.length > 0) {
      instruments = await this.instrumentRepository.find({
        where: { id: In(instrumentIds) },
        relations: ['marketData'],
      });
    }

    // Para cada instrumento, busca el registro de MarketData más reciente
    const positions = [];
    let totalPositionsValue = 0;

    for (const instrument of instruments) {
      const cantidad = netPositions.get(instrument.id) ?? 0;
      if (cantidad === 0) continue; // No tiene posición real

      // marketData[] => obtener el más reciente (por datetime)
      if (!instrument.marketData || instrument.marketData.length === 0) {
        // Si no hay datos de mercado, asumimos precio = 0
        positions.push({
          instrumentumentId: instrument.id,
          ticker: instrument.ticker,
          cantidad: cantidad,
          marketValue: 0,
          dailyReturnPercent: 0, // No hay previousClose
        });
        continue;
      }

      // Reduce para encontrar el marketData más reciente
      const latestData = instrument.marketData.reduce((prev, curr) =>
        curr.date > prev.date ? curr : prev,
      );

      const priceNow = latestData.close;
      const pricePrev = latestData.previousclose || latestData.close; // Evitar NaN, si no hay un previousClose utilizamos el valor del close
      const positionValue = cantidad * priceNow;
      const dailyReturnPercent =
        pricePrev === 0 ? 0 : ((priceNow - pricePrev) / pricePrev) * 100;

      totalPositionsValue += positionValue;

      positions.push({
        instrumentId: instrument.id,
        ticker: instrument.ticker,
        cantidad: cantidad,
        marketValue: positionValue,
        totalValue: cantidad * positionValue,
        dailyReturnPercent,
      });
    }

    const totalPesos = availableFunds + totalPositionsValue;

    return {
      userid: user.id,
      total: totalPesos,
      pesos_disponibles: availableFunds,
      positions,
    };
  }
}
