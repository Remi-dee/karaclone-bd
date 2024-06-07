import { Controller, Post, Body, HttpException, Get, Param, Put } from '@nestjs/common';
import { MonoService } from './mono.service';
import { MonoUser } from './mono-user.schema';

@Controller('mono')
export class MonoController {
  constructor(private readonly monoService: MonoService) {}
  private readonly redirect_url = 'https://mono.co';

  @Post('accounts/initiate')
  async initiateAccountAuth(
    @Body('customer') customer: any,
    @Body('meta') meta: any,
  ) {
    const scope = 'auth';
    try {
      const result = await this.monoService.initiateAccountAuth(
        customer,
        meta,
        scope,
        this.redirect_url,
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('accounts/auth')
  async completeAccountAuth(@Body('code') code: string) {
    try {
      const result = await this.monoService.completeAccountAuth(code);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('payments/initiate')
  async initiatePayment(@Body() paymentData: any) {
    try {
      const result = await this.monoService.initiatePayment(paymentData);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

//Mono Management
@Post('create-user')
async createMonoUser(
  @Body('userId') userId: string,
  @Body() monoDetails: any,
): Promise<MonoUser> {
  return this.monoService.createMonoUser(userId, monoDetails);
}

@Get('user/:userId')
async getMonoUserByUserId(@Param('userId') userId: string): Promise<MonoUser> {
  return this.monoService.findMonoUserByUserId(userId);
}

@Put('update-user/:userId')
async updateMonoUser(@Param('userId') userId: string, @Body() monoDetails: any): Promise<MonoUser> {
  return this.monoService.updateMonoUser(userId, monoDetails);
}

}
