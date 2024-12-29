import { Order, MarketData } from '../entities';
import { Repository } from 'typeorm';

/**
 * Verifica si el usuario tiene fondos/acciones suficientes al crear una orden (BUY, SELL, CASH_IN, CASH_OUT).
 */
export async function checkFundsOrShares(
  userId: number,
  instrumentId: number,
  side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT',
  size: number,
  price: number,
  orderRepo: Repository<Order>,
): Promise<boolean> {
  if (side === 'BUY') {
    const availableFunds = await calculateAvailableFunds(userId, orderRepo);
    return size * price <= availableFunds;
  } else if (side === 'SELL') {
    const userShares = await calculateUserShares(
      userId,
      instrumentId,
      orderRepo,
    );
    return size <= userShares;
  } else if (side === 'CASH_IN') {
    return true; // Un depósito no necesita validación
  } else if (side === 'CASH_OUT') {
    const availableFunds = await calculateAvailableFunds(userId, orderRepo);
    return size <= availableFunds;
  }

  return false; // por si side es otra cosa
}

/**
 * Calcula los pesos disponibles (fondos) de un usuario a partir de las órdenes FILLED.
 */
export async function calculateAvailableFunds(
  userId: number,
  orderRepo: Repository<Order>,
): Promise<number> {
  const filledOrders = await orderRepo.find({
    where: { user: { id: userId }, status: 'FILLED' },
  });

  let funds = 0;
  for (const order of filledOrders) {
    if (order.side === 'CASH_IN') {
      funds += order.size;
    } else if (order.side === 'CASH_OUT') {
      funds -= order.size;
    } else if (order.side === 'BUY') {
      funds -= order.size * order.price;
    } else if (order.side === 'SELL') {
      funds += order.size * order.price;
    }
  }

  return funds;
}

/**
 * Retorna el último precio de `MarketData` (close) para un instrumento dado.
 */
export async function getLastClosePrice(
  instrumentId: number,
  marketDataRepo: Repository<MarketData>,
): Promise<number> {
  const data = await marketDataRepo.find({
    where: { instrument: { id: instrumentId } },
    order: { date: 'DESC' },
    take: 1,
  });
  return data[0]?.close ?? 0;
}

/**
 * Calcula cuántas acciones posee el usuario de un instrumento (posición neta).
 */
export async function calculateUserShares(
  userId: number,
  instrumentId: number,
  orderRepo: Repository<Order>,
): Promise<number> {
  const filledOrders = await orderRepo.find({
    where: {
      user: { id: userId },
      instrument: { id: instrumentId },
      status: 'FILLED',
    },
  });

  let totalShares = 0;
  for (const order of filledOrders) {
    if (order.side === 'BUY') {
      totalShares += order.size;
    } else if (order.side === 'SELL') {
      totalShares -= order.size;
    }
  }

  return totalShares;
}
