import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrueLayerService } from './truelayer.service';
import { TrueLayerController } from './truelayer.controller';

@Module({
  imports: [ConfigModule],
  controllers: [TrueLayerController],
  providers: [TrueLayerService],
  exports: [TrueLayerService],
})
export class TrueLayerModule {}
