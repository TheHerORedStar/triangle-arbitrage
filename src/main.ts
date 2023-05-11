import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

const { PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Crawl Trading data and detect triangle arbitrage
  const triangleArbitrageService = app.get(AppService);
  triangleArbitrageService.crawlTradingData();
  setTimeout(() => triangleArbitrageService.detectTriangleArbitrage(), 1000);

  await app.listen(PORT || 8001);
  console.info(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
