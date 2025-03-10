import { Module } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { StellarController } from './stellar.controller';

@Module({
  providers: [StellarService],
  controllers: [StellarController]
})
export class StellarModule {}
