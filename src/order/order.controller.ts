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
  import { OrderService } from './order.service';
  import { Order } from '../entities/order.entity';
  
  @Controller('orders')
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    @Get()
    async findAll(): Promise<Order[]> {
      return this.orderService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Order> {
      const order = await this.orderService.findOne(id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    }
  
    @Post()
    async create(@Body() orderData: Partial<Order>): Promise<Order> {
      return this.orderService.create(orderData);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() orderData: Partial<Order>,
    ): Promise<Order> {
      const updatedOrder = await this.orderService.update(id, orderData);
      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return updatedOrder;
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
      await this.orderService.remove(id);
      return { message: `Order with ID ${id} deleted successfully` };
    }
  
    @Get('user/:userId')
    async findByUser(@Param('userId') userId: number): Promise<Order[]> {
      return this.orderService.findByUser(userId);
    }
  
    @Get('/status')
    async findByStatus(@Query('status') status: string): Promise<Order[]> {
      return this.orderService.findByStatus(status);
    }
  
    @Get('instrument/:instrumentId')
    async findByInstrument(
      @Param('instrumentId') instrumentId: number,
    ): Promise<Order[]> {
      return this.orderService.findByInstrument(instrumentId);
    }
  }
  