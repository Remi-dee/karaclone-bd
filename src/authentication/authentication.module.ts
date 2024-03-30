import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import configuration from '../config/configuration';
import { User, UserSchema } from '../user/user.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, UserService],
  exports: [JwtStrategy]
})
export class AuthenticationModule {}
