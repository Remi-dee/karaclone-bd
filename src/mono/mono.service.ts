import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { MonoUser } from './mono-user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMonoUserDTO, UpdateMonoUserDTO } from './mono.dto';

@Injectable()
export class MonoService {
  private readonly BASE_URL = 'https://api.withmono.com/v2';
  constructor(
    @InjectModel(MonoUser.name) private readonly monoUserModel: Model<MonoUser>,
  ) {}

  async initiateAccountAuth(data: object): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/accounts/initiate`,
        data,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async completeAccountAuth(code: string, userId: string): Promise<any> {
    const url = `${this.BASE_URL}/v2/accounts/auth`;
    try {
      const response = await axios.post(
        url,
        { code },
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'mono-sec-key': process.env['MONO_SECRET_KEY'],
          },
        },
      );

      const { id: monoId } = response.data;

      const createMonoUserDTO: CreateMonoUserDTO = {
        userId,
        monoId,
        monoCode: code,
        monoStatus: false,
      };

      const monoUser = new this.monoUserModel(createMonoUserDTO);
      await monoUser.save();

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async initiatePayment(paymentData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/payments/initiate`,
        paymentData,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'mono-sec-key': process.env['MONO_SECRET_KEY'],
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Mono User Management
  async createMonoUser(
    userId: string,
    createMonoUserDto: CreateMonoUserDTO,
  ): Promise<MonoUser> {
    const existingUser = await this.monoUserModel.findOne({ userId });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = new this.monoUserModel({ userId, ...createMonoUserDto });
    return newUser.save();
  }

  async findMonoUserByUserId(userId: string): Promise<MonoUser> {
    const monoUser = await this.monoUserModel.findOne({ userId }).exec();
    if (!monoUser) {
      throw new NotFoundException('Mono user not found');
    }
    return monoUser;
  }

  async updateMonoUser(
    userId: string,
    updateMonoUserDto: UpdateMonoUserDTO,
  ): Promise<MonoUser> {
    const user = await this.monoUserModel.findOneAndUpdate(
      { userId },
      updateMonoUserDto,
      { new: true },
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
