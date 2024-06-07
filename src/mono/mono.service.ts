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

@Injectable()
export class MonoService {
  private readonly BASE_URL = 'https://api.withmono.com/v2';
  constructor(
    @InjectModel(MonoUser.name) private readonly monoUserModel: Model<MonoUser>,
  ) {}
  async initiateAccountAuth(
    customer: any,
    meta: any,
    scope: string,
    redirectUrl: string,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/accounts/initiate`,
        {
          customer,
          meta,
          scope,
          redirect_url: redirectUrl,
        },
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

  async completeAccountAuth(code: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/accounts/auth`,
        {
          code,
        },
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

  async initiatePayment(paymentData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/payments/initiate`,
        paymentData,
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


  // Mono User Management
  async createMonoUser(userId: string, monoDetails: any): Promise<MonoUser> {
    const newMonoUser = new this.monoUserModel({ userId, ...monoDetails });
    return newMonoUser.save();
  }

  async findMonoUserByUserId(userId: string): Promise<MonoUser> {
    const monoUser = await this.monoUserModel.findOne({ userId }).exec();
    if (!monoUser) {
      throw new NotFoundException('Mono user not found');
    }
    return monoUser;
  }

  async updateMonoUser(userId: string, monoDetails: any): Promise<MonoUser> {
    const monoUser = await this.findMonoUserByUserId(userId);
    Object.assign(monoUser, monoDetails);
    return monoUser.save();
  }
}
