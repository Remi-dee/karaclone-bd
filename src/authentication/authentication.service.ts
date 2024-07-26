import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { IAuthenticationResponse } from '../user/user.dto';
import * as argon from 'argon2';
import ErrorHandler from '../utils/ErrorHandler';
import { EmailService } from '../mail/mail.service';
import {
  IActivationRequest,
  IActivationToken,
  LoginUserDTO,
  RegisterUserDTO,
} from './authentication.dto';
import * as speakeasy from 'speakeasy';
import { Keypair } from 'stellar-sdk';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: EmailService,
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

  async login(user: LoginUserDTO): Promise<any> {
    const userDetails = await this.validateUser(user.email, user.password);

    if (!userDetails) {
      throw new ErrorHandler('Please confirm your login details', 400);
    }

    if (userDetails.isTwoFactorEnabled) {
      // Generate a unique 2FA code
      const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();

      // Store the 2FA code and expiry time (e.g., 5 minutes from now)
      userDetails.twoFACode = twoFACode;
      userDetails.twoFACodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Save the user details
      await userDetails.save();

      // Send the 2FA code to the user's email
      const data = { user: { name: userDetails.name }, twoFACode };
      await this.mailService.sendMail({
        email: userDetails.email,
        subject: 'Your 2FA Login Code',
        template: 'two-fa-mail',
        context: data,
      });

      return {
        message:
          'A 2FA code has been sent to your email. Please verify to continue.',
        isTwoFactorEnabled: true,
        user: this.userService.getUserDetails(userDetails),
      };
    } else {
      const payload = {
        email: userDetails.email,
        sub: userDetails._id,
      };

      return {
        message: 'Login Successful',
        isTwoFactorEnabled: false,
        accessToken: this.jwtService.sign(payload),
        user: this.userService.getUserDetails(userDetails),
      };
    }
  }

  async register(regBody: RegisterUserDTO) {
    const {
      name,
      email,
      password,
      account_type,
      role,
      business_address,
      gender,
      phone,
      business_email,
      business_line,
      business_name,
      date_of_birth,
      city,
      state,
      zip,
      country_code,
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
      role,
      business_address,
      gender,
      phone,
      business_email,
      business_line,
      business_name,
      date_of_birth,
      city,
      state,
      zip,
      country_code,
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
      role,
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
      role,
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

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await argon.hash(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/new-password?token=${resetToken}`;
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    console.log('this is', resetToken);
    const data = { user: { name: user.name }, resetUrl };

    this.mailService.sendMail({
      email: user.email,
      subject: 'Password Reset Request',
      template: 'reset-password-mail',
      context: data,
    });
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user || !(await argon.verify(user.resetPasswordToken, resetToken))) {
      throw new ErrorHandler('Invalid or expired password reset token', 400);
    }

    user.password = await argon.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async verifyTwoFA(
    userId: string,
    code: string,
  ): Promise<IAuthenticationResponse> {
    console.log('here is user id', userId);
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    if (
      !user.twoFACode ||
      user.twoFACode !== code ||
      user.twoFACodeExpiry < new Date()
    ) {
      throw new ErrorHandler('Invalid or expired 2FA code', 400);
    }

    // Clear the 2FA code and expiry
    user.twoFACode = undefined;
    user.twoFACodeExpiry = undefined;
    await user.save();

    const payload = {
      email: user.email,
      sub: user._id,
    };

    return {
      user: this.userService.getUserDetails(user),
      accessToken: this.jwtService.sign(payload),
    };
  }
}
