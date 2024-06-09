import {
  Controller,
  Post,
  Body,
  HttpException,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { MonoService } from './mono.service';
import { MonoUser } from './mono-user.schema';
import {
  CreateMonoUserDTO,
  InitiateAccountDTO,
  InitiatePaymentDTO,
  UpdateMonoUserDTO,
} from './mono.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Mono')
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('mono')
export class MonoController {
  constructor(private readonly monoService: MonoService) {}
  private readonly redirect_url = 'https://mono.co';

  @Post('accounts/initiate')
  @ApiOperation({ summary: 'Initiate account with Mono' })
  @ApiBody({
    description: 'Initiate account data',
    type: InitiateAccountDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Account initiation completed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred during account initiation',
  })
  async initiateAccountAuth(@Body() initiateAccountDto: InitiateAccountDTO) {
    const scope = 'auth';
    const data = {
      ...initiateAccountDto,
      scope,
    };
    try {
      const result = await this.monoService.initiateAccountAuth(data);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('accounts/auth')
  @ApiOperation({ summary: 'Complete account authentication with Mono' })
  @ApiBody({
    description: 'User ID and authentication code',
    type: CreateMonoUserDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Account authentication completed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred during authentication',
  })
  async completeAccountAuth(
    @Body('code') code: string,
    @Body('userId') userId: string,
  ) {
    try {
      const result = await this.monoService.completeAccountAuth(code, userId);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('payments/initiate')
  @Post('initiate-payment')
  @ApiOperation({ summary: 'Initiate payment with Mono' })
  @ApiBody({
    description: 'Initiate payment data',
    type: InitiatePaymentDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment initiation completed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred during payment initiation',
  })
  async initiatePayment(
    @Body() initiatePaymentDto: InitiatePaymentDTO,
  ): Promise<any> {
    return this.monoService.initiatePayment(initiatePaymentDto);
  }

  //Mono Management
  @Post('create-mono-user')
  @ApiOperation({ summary: 'Create a Mono user' })
  @ApiBody({
    description: 'Mono user data',
    type: CreateMonoUserDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Mono user created successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred during Mono user creation',
  })
  async createMonoUser(
    @Body() createMonoUserDto: CreateMonoUserDTO,
  ): Promise<MonoUser> {
    return this.monoService.createMonoUser(
      createMonoUserDto.userId,
      createMonoUserDto,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get Mono user by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Mono user retrieved successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred while retrieving Mono user',
  })
  async getMonoUserByUserId(
    @Param('userId') userId: string,
  ): Promise<MonoUser> {
    return this.monoService.findMonoUserByUserId(userId);
  }

  @Put('update-user/:userId')
  @ApiOperation({ summary: 'Update Mono user by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiBody({
    description: 'Mono user data to update',
    type: UpdateMonoUserDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Mono user updated successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred while updating Mono user',
  })
  async updateMonoUser(
    @Param('userId') userId: string,
    @Body() updateMonoUserDto: UpdateMonoUserDTO,
  ): Promise<MonoUser> {
    return this.monoService.updateMonoUser(userId, updateMonoUserDto);
  }
}
