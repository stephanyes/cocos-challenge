import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from '../order/order.service';
import { Order, User, Instrument, MarketData } from '../entities';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../order/create.dto';
import * as utils from '../utils/utils';
import { ARS_CODE } from 'src/constants/constants';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepo: Repository<Order>;
  let userRepo: Repository<User>;
  let instrumentRepo: Repository<Instrument>;
  let marketDataRepo: Repository<MarketData>;

  const mockOrderRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockUserRepo = {
    findOne: jest.fn(),
  };
  const mockInstrumentRepo = {
    findOne: jest.fn(),
  };
  const mockMarketDataRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrderService,
          {
            provide: getRepositoryToken(Order),
            useValue: mockOrderRepo,
          },
          {
            provide: getRepositoryToken(User),
            useValue: mockUserRepo,
          },
          {
            provide: getRepositoryToken(Instrument),
            useValue: mockInstrumentRepo,
          },
          {
            provide: getRepositoryToken(MarketData),
            useValue: mockMarketDataRepo,
          },
        ],
      }).compile();
    orderService = module.get<OrderService>(OrderService);
    orderRepo = module.get<Repository<Order>>(getRepositoryToken(Order));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    instrumentRepo = module.get<Repository<Instrument>>(getRepositoryToken(Instrument));
    marketDataRepo = module.get<Repository<MarketData>>(getRepositoryToken(MarketData));
    jest.clearAllMocks();
  });

  describe('createNewOrder', () => {
    it('debería rechazar si no existe el usuario', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(undefined);

      const dto: CreateOrderDto = {
        userid: 999,
        instrumentid: 31,
        side: 'BUY',
        size: 10,
        type: 'MARKET',
      };

      await expect(orderService.createNewOrder(dto)).rejects.toThrow(NotFoundException);
    });
    it('debería rechazar si no existe el instrumento', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue({ id: 1 } as User);
      jest.spyOn(instrumentRepo, 'findOne').mockResolvedValue(undefined);

      const dto: CreateOrderDto = {
        userid: 1,
        instrumentid: 999,
        side: 'BUY',
        size: 10,
        type: 'MARKET',
      };

      await expect(orderService.createNewOrder(dto)).rejects.toThrow(NotFoundException);
    });
    it('debería crear una orden de COMPRA MARKET y completarla si hay fondos suficientes', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1 });
      mockInstrumentRepo.findOne.mockResolvedValue({ id: 31 });
      // Mock a la función getLastClosePrice desde utils
      jest.spyOn(utils, 'getLastClosePrice').mockResolvedValue(100);
      jest.spyOn(utils as any, 'checkFundsOrShares').mockResolvedValue(true);

      mockOrderRepo.create.mockImplementation((dto) => dto);
      mockOrderRepo.save.mockImplementation(async (order) => ({
        ...order,
        id: 999,
      }));

      const dto: CreateOrderDto = {
        userid: 1,
        instrumentid: 31,
        side: 'BUY',
        size: 10,
        type: 'MARKET',
      };

      const result = await orderService.createNewOrder(dto);

      expect(result.id).toBe(999);
      expect(result.status).toBe('FILLED');
      expect(result.price).toBe(100);
      expect(mockOrderRepo.create).toHaveBeenCalled();
      expect(mockOrderRepo.save).toHaveBeenCalled();
    });
    it('debería rechazar una orden de COMPRA MARKET si no hay fondos suficientes', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1 } as User);
      mockInstrumentRepo.findOne.mockResolvedValue({ id: 31 } as Instrument);

      jest.spyOn(utils, 'getLastClosePrice').mockResolvedValue(200);
      jest.spyOn(utils as any, 'checkFundsOrShares').mockResolvedValue(false);

      mockOrderRepo.create.mockImplementation((dto) => dto);
      mockOrderRepo.save.mockImplementation(async (order) => ({
        ...order,
        id: 1000,
      }));

      const dto: CreateOrderDto = {
        userid: 1,
        instrumentid: 31,
        side: 'BUY',
        size: 1,
        type: 'MARKET',
      };

      const result = await orderService.createNewOrder(dto);

      expect(result.status).toBe('REJECTED');
      expect(mockOrderRepo.create).toHaveBeenCalled();
      expect(mockOrderRepo.save).toHaveBeenCalled();
    });
    it('debería crear una orden de CASH_IN con estado FILLED y precio = 0', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1 } as User);
      mockInstrumentRepo.findOne.mockResolvedValueOnce({ id: ARS_CODE } as Instrument);
      mockOrderRepo.create.mockImplementation((dto) => dto);
      mockOrderRepo.save.mockImplementation(async (order) => {
        return { ...order, id: 222 } as Order;
      });
    
      const dto: CreateOrderDto = {
        userid: 1,
        instrumentid: 999,
        side: 'CASH_IN',
        size: 5000,
        type: 'MARKET',
      };
    
      const result = await orderService.createNewOrder(dto);
      expect(result.id).toBe(222);
      expect(result.side).toBe('CASH_IN');
      expect(result.status).toBe('FILLED');
      expect(result.price).toBe(1);
      expect(result.instrument.id).toBe(ARS_CODE);
      expect(mockOrderRepo.create).toHaveBeenCalled();
      expect(mockOrderRepo.save).toHaveBeenCalled();
    });
  });
});
