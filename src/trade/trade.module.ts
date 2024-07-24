import { Module } from '@nestjs/common';

import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { BuyTradeSchema, TradeSchema } from './trade.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Beneficiary, BeneficiarySchema } from './beneficiary.schema';

import { UserTransactionsModule } from 'src/users-transactions/user-transactions.module';

import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    AuthenticationModule,
    UserTransactionsModule,
    NotificationModule,
    MongooseModule.forFeature([
      { name: 'Trade', schema: TradeSchema },
      { name: User.name, schema: UserSchema },
      { name: Beneficiary.name, schema: BeneficiarySchema },
      { name: 'BuyTrade', schema: BuyTradeSchema }, // Register BuyTrade schema
    ]),
  ],
  providers: [TradeService],
  controllers: [TradeController],
  exports: [TradeService],
})
export class TradeModule {}
