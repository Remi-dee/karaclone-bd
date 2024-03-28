import { Module } from '@nestjs/common';
import { TransactionFeeController } from './transaction-fee.controller';
import { TransactionFeeService } from './transaction-fee.service';

@Module({
  controllers: [TransactionFeeController],
  providers: [TransactionFeeService]
})
export class TransactionFeeModule {}
