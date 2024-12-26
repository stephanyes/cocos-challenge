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
  import { MarketService } from './market.service';
  import { MarketData } from '../entities/market.entity';
  
  @Controller('market')
  export class MarketController {
    constructor(private readonly marketService: MarketService) {}
  
    @Get()
    async findAll(): Promise<MarketData[]> {
      return this.marketService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<MarketData> {
      const marketData = await this.marketService.findOne(id);
      if (!marketData) {
        throw new NotFoundException(`Market data with ID ${id} not found`);
      }
      return marketData;
    }
  
    @Post()
    async create(@Body() marketData: Partial<MarketData>): Promise<MarketData> {
      return this.marketService.create(marketData);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() marketData: Partial<MarketData>,
    ): Promise<MarketData> {
      const updatedMarketData = await this.marketService.update(id, marketData);
      if (!updatedMarketData) {
        throw new NotFoundException(`Market data with ID ${id} not found`);
      }
      return updatedMarketData;
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
      await this.marketService.remove(id);
      return { message: `Market data with ID ${id} deleted successfully` };
    }
  
    @Get('instrument/:instrumentId')
    async findByInstrument(
      @Param('instrumentId') instrumentId: number,
    ): Promise<MarketData[]> {
      return this.marketService.findByInstrument(instrumentId);
    }
  
    @Get('date')
    async findByDateRange(
      @Query('start') start: string,
      @Query('end') end: string,
    ): Promise<MarketData[]> {
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new NotFoundException(`Invalid date range`);
      }
  
      return this.marketService.findByDateRange(startDate, endDate);
    }
  }
  