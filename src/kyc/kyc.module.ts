import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { KYC, KYCSchema } from './kyc.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: KYC.name, schema: KYCSchema }])],
  providers: [KycService],
  controllers: [KycController],
})
export class KycModule {}
