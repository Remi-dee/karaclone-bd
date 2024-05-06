import { Module } from '@nestjs/common';

import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { Trade, TradeSchema } from './trade.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
