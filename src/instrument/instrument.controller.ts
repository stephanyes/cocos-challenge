import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    NotFoundException,
    Query,
  } from '@nestjs/common';
  import { InstrumentService } from './instrument.service';
  import { Instrument } from '../entities/instrument.entity';
  
  @Controller('instruments')
  export class InstrumentController {
    constructor(private readonly instrumentService: InstrumentService) {}
  
    @Get()
    async findAll(): Promise<Instrument[]> {
      return this.instrumentService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Instrument> {
      const instrument = await this.instrumentService.findOne(id);
      if (!instrument) {
        throw new NotFoundException(`Instrument with ID ${id} not found`);
      }
      return instrument;
    }
  
    @Post()
    async create(@Body() instrumentData: Partial<Instrument>): Promise<Instrument> {
      return this.instrumentService.create(instrumentData);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() instrumentData: Partial<Instrument>,
    ): Promise<Instrument> {
      const updatedInstrument = await this.instrumentService.update(id, instrumentData);
      if (!updatedInstrument) {
        throw new NotFoundException(`Instrument with ID ${id} not found`);
      }
      return updatedInstrument;
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
      await this.instrumentService.remove(id);
      return { message: `Instrument with ID ${id} deleted successfully` };
    }
  
    @Get('/type/:type')
    async findByType(@Param('type') type: string): Promise<Instrument[]> {
      return this.instrumentService.findByType(type);
    }
  
    @Get('/ticker/:ticker')
    async findByTicker(@Param('ticker') ticker: string): Promise<Instrument> {
      const instrument = await this.instrumentService.findByTicker(ticker);
      if (!instrument) {
        throw new NotFoundException(`Instrument with ticker ${ticker} not found`);
      }
      return instrument;
    }
  }
  