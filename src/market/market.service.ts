import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MarketData } from '../entities';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketRepository: Repository<MarketData>,
  ) {}

  findAll(): Promise<MarketData[]> {
    return this.marketRepository.find({
      relations: ['instrument'],
    });
  }

  async findOne(id: number): Promise<MarketData> {
    const marketData = await this.marketRepository.findOne({
      where: { id },
      relations: ['instrument'],
    });

    if (!marketData) {
      throw new NotFoundException(`Market data with ID ${id} not found`);
    }

    return marketData;
  }

  create(marketData: Partial<MarketData>): Promise<MarketData> {
    const newMarketData = this.marketRepository.create(marketData);
    return this.marketRepository.save(newMarketData);
  }

  async update(
    id: number,
    marketData: Partial<MarketData>,
  ): Promise<MarketData> {
    await this.marketRepository.update(id, marketData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const marketData = await this.findOne(id);
    if (!marketData) {
      throw new NotFoundException(`Market data with ID ${id} not found`);
    }
    await this.marketRepository.delete(id);
  }

  findByInstrument(instrumentId: number): Promise<MarketData[]> {
    return this.marketRepository.find({
      where: { instrument: { id: instrumentId } },
      relations: ['instrument'],
    });
  }

  findByDateRange(startDate: Date, endDate: Date): Promise<MarketData[]> {
    return this.marketRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['instrument'],
    });
  }
}
