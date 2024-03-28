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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
