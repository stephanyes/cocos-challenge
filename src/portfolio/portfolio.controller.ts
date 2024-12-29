import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':userId')
  async getUserPortfolio(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.getPortfolio(userId);
  }
}
