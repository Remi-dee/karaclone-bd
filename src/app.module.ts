import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './mail/mail.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaystackModule } from './paystack/paystack.module';
import { StellarModule } from './stellar/stellar.module';
import configuration from './config/configuration';
import { currencyPairModule } from './currencyPair/currency-pair.module';
import { ConversionFeeModule } from './conversion-fee/conversion-fee.module';
import { TransactionFeeModule } from './transaction-fee/transaction-fee.module';
import { TradeModule } from './trade/trade.module';
import { CurrencyConversionModule } from './currency-conversion/currency-conversion.module';
import { KycModule } from './kyc/kyc.module';
import { MonoModule } from './mono/mono.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    AuthenticationModule,
    MailModule,
    WalletModule,
    TransactionModule,
    PaystackModule,
    StellarModule,
    currencyPairModule,
    TransactionFeeModule,
    ConversionFeeModule,
    TradeModule,
    CurrencyConversionModule,
    KycModule,
    MonoModule,
    TrueLayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
