import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import MyWebSocketGateway from './socket.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MyWebSocketGateway],
})
export class AppModule {}
