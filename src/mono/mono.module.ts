import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonoService } from './mono.service';
import { MonoController } from './mono.controller';
import { MonoUser, MonoUserSchema } from './mono-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MonoUser.name, schema: MonoUserSchema }]),
  ],
  controllers: [MonoController],
  providers: [MonoService],
})
export class MonoModule {}
