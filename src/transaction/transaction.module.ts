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
import { Wallet, WalletSchema } from 'src/wallet/wallet.schema';
import { Transaction, TransactionSchema } from './transaction.schema';

@Module({
  imports: [
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
