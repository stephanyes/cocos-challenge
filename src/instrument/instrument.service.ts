import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instrument } from '../entities';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
  ) {}

  findAll(): Promise<Instrument[]> {
    return this.instrumentRepository.find();
  }

  async findOne(id: number): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
    });
    if (!instrument) {
      throw new NotFoundException(`Instrument with ID ${id} not found`);
    }
    return instrument;
  }

  create(instrumentData: Partial<Instrument>): Promise<Instrument> {
    const newInstrument = this.instrumentRepository.create(instrumentData);
    return this.instrumentRepository.save(newInstrument);
  }

  async update(
    id: number,
    instrumentData: Partial<Instrument>,
  ): Promise<Instrument> {
    await this.instrumentRepository.update(id, instrumentData);
    const updatedInstrument = await this.findOne(id);
    return updatedInstrument;
  }

  async remove(id: number): Promise<void> {
    const instrument = await this.findOne(id);
    if (!instrument) {
      throw new NotFoundException(`Instrument with ID ${id} not found`);
    }
    await this.instrumentRepository.delete(id);
  }

  findByType(type: string): Promise<Instrument[]> {
    return this.instrumentRepository.find({
      where: { type: type.toUpperCase() },
    });
  }

  async findByTicker(ticker: string): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findOne({
      where: { ticker: ticker.toUpperCase() },
    });
    if (!instrument) {
      throw new NotFoundException(
        `Instrument with ticker ${ticker.toUpperCase()} not found`,
      );
    }
    return instrument;
  }
}
