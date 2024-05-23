import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    Logger.log('payload', payload);

    let userEmail;
    if (payload.user && payload.user.email) {
      userEmail = payload.user.email;
    } else if (payload.email) {
      userEmail = payload.email;
    } else {
      throw new UnauthorizedException('Invalid payload structure');
    }

    const user = await this.userService.findOneByEmail(userEmail);

    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }

    Logger.log('user', user.name);

    return user;
  }
}
