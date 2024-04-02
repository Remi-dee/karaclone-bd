import { Module } from '@nestjs/common';
import { ConversionFeeController } from './conversion-fee.controller';
import { ConversionFeeService } from './conversion-fee.service';
import {
  ConversionFee,
  ConversionFeeSchema,
 
} from './schema/conversion-fee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';

import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([
      { name: ConversionFee.name, schema: ConversionFeeSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ConversionFeeController],
  providers: [ConversionFeeService],
})
export class ConversionFeeModule {}
