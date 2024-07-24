import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTransactionsService } from './user-transactions.service';
import { UserTransactionsController } from './user-transactions.controller';
import { UserTransactionSchema } from './user-transactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserTransaction', schema: UserTransactionSchema },
    ]),
  ],
  providers: [UserTransactionsService],
  controllers: [UserTransactionsController],
  exports: [UserTransactionsService],
})
export class UserTransactionsModule {}
