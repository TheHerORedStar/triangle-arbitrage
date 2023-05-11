import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TraddingBackboneDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  time: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class CoinPairsDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  l1: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  l2: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  l3: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  d1: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  d2: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  d3: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  lv1: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  lv2: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  lv3: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  tpath: string;
}
