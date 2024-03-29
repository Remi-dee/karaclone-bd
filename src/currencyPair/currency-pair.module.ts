import { Module, forwardRef } from '@nestjs/common';
import { CurrencyPairService } from './currency-pair.service';
import { CurrencyPairController } from './currency-pair.controller';
import { CurrencyPair, CurrencyPairSchema } from './currency-pair.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CurrencyPair.name, schema: CurrencyPairSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [CurrencyPairController],
  providers: [CurrencyPairService, UserService],
})
export class currencyPairModule {}
