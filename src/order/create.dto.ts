import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userid: number;

  @IsNotEmpty()
  @IsNumber()
  instrumentid: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['BUY', 'SELL', 'CASH_IN', 'CASH_OUT'])
  side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT';

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['MARKET', 'LIMIT'])
  type: 'MARKET' | 'LIMIT';
}
