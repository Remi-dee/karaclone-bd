import { Module, forwardRef } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet, WalletSchema } from './wallet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from '../transaction/transaction.module';
import { User, UserSchema } from '../user/user.schema';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => TransactionModule),
  ],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
