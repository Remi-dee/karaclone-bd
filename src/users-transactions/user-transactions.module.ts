import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTransactionsService } from './user-transactions.service';
import { UserTransactionsController } from './user-transactions.controller';
import {
  UserTransaction,
  UserTransactionSchema,
} from './user-transactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserTransaction.name, schema: UserTransactionSchema },
    ]),
  ],
  providers: [UserTransactionsService],
  controllers: [UserTransactionsController],
})
export class UserTransactionsModule {}
