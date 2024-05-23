import { Module } from '@nestjs/common';
import { CurrencyConversionService } from './currency-conversion.service';
import { CurrencyConversionController } from './currency-conversion.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';

import { currencyPairModule } from 'src/currencyPair/currency-pair.module';

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    currencyPairModule,
  ],
  providers: [CurrencyConversionService],
  controllers: [CurrencyConversionController],
})
export class CurrencyConversionModule {}
