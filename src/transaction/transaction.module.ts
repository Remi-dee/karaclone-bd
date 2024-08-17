import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { PaystackService } from '../paystack/paystack.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletModule } from '../wallet/wallet.module';
import { Wallet, WalletSchema } from '../wallet/wallet.schema';
import { Transaction, TransactionSchema } from './transaction.schema';
import { UserTransactionsModule } from 'src/users-transactions/user-transactions.module';
import { TradeModule } from 'src/trade/trade.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    UserTransactionsModule,
    TradeModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => WalletModule),
  ],
  providers: [TransactionService, PaystackService, UserService, WalletService],
  controllers: [TransactionController],
})
export class TransactionModule {}
