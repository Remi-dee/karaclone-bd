import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import {
  IAuthenticationResponse,
  LoginUserDTO,
  RegisterUserDTO,
} from '../user/user.dto';
import * as argon from 'argon2';
import ErrorHandler from '../utils/ErrorHandler';
import { EMailService } from '../mail/mail.service';
import { IActivationRequest, IActivationToken } from './authentication.dto';
import * as speakeasy from 'speakeasy';
import { Keypair } from 'stellar-sdk';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: EMailService,
  ) {}

  isValidEmail(email: string): boolean {
    // Basic email format validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await argon.verify(user.password, password))) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: LoginUserDTO): Promise<IAuthenticationResponse> {
    const userDetails = await this.validateUser(user.email, user.password);

    if (!userDetails)
      throw new ErrorHandler('Please confirm your login details', 400);

    const payload = {
      email: userDetails.email,
      sub: userDetails._id,
    };
    return {
      user: this.userService.getUserDetails(userDetails),
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(regBody: RegisterUserDTO) {
    const {
      name,
      email,
      password,
      account_type,
      business_address,
      gender,
      phone,
      business_email,
      business_line,
      business_name,
    } = regBody;

    if (!this.isValidEmail(email)) {
      throw new ErrorHandler('Invalid email address.', 400);
    }

    const isEmailExist = await this.userModel.findOne({ email });
    if (isEmailExist) {
      throw new ErrorHandler('Email already exist', 400);
    }

    const user: RegisterUserDTO = {
      name,
      email,
      password,
      account_type,
      business_address,
      gender,
      phone,
      business_email,
      business_line,
      business_name,
    };

    const activationToken = this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };

    try {
      this.mailService.sendMail({
        email: user.email,
        subject: 'Activate your account',
        template: 'activation-mail',
        context: data,
      });

      return activationToken.token;
    } catch (error: any) {
      throw new ErrorHandler(error.message, 400);
    }
  }

  createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign({
      user,
      activationCode,
    });

    return { token, activationCode };
  };

  async activateUser(activationDto: IActivationRequest) {
    const { activation_token, activation_code } = activationDto;

    const newUser: { user: User; activationCode: string } =
      this.jwtService.verify(activation_token) as {
        user: User;
        activationCode: string;
      };

    if (newUser.activationCode !== activation_code) {
      throw new ErrorHandler('Invalid activation code', 400);
    }

    const {
      name,
      email,
      password,
      account_type,
      gender,
      phone,
      business_name,
      business_address,
      business_email,
      business_line,
    } = newUser.user;

    const existUser = await this.userModel.findOne({ email });

    if (existUser) {
      throw new ErrorHandler('Email already exist', 400);
    }

    // Generate a new Stellar key pair
    const pair = Keypair.random();

    // Get the public and secret keys
    const publicKey = pair.publicKey();
    const secretKey = pair.secret();

    const secret = speakeasy.generateSecret({ length: 20 });

    const hashedPassword = await argon.hash(password);

    await this.userModel.create({
      name,
      email,
      account_type,
      gender,
      phone,
      business_name,
      business_address,
      business_email,
      business_line,
      secret: secret.base32,
      public_key: publicKey,
      secret_key: secretKey,
      password: hashedPassword,
      is_verified: true,
    });
  }
}
