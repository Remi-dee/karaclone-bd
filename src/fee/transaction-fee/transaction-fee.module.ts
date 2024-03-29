import { Module } from '@nestjs/common';
import { TransactionFeeController } from './transaction-fee.controller';
import { TransactionFeeService } from './transaction-fee.service';
import {
  TransactionFee,
  TransactionFeeSchema,
} from './schema/transaction-fee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionFee.name, schema: TransactionFeeSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TransactionFeeController],
  providers: [TransactionFeeService],
})
export class TransactionFeeModule {}
