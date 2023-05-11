import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TraddingBackboneDto } from './dto/tradding-backbone.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Get('/trading-backbone')
  async traddingDataBackbone(): Promise<TraddingBackboneDto[]> {
    return await this.appService.processData();
  }
}
