// transaction.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { TradeService } from './trade.service';
import { CreateTradeDTO } from './trade.dto';
import { ObjectId } from 'mongoose';
import { CreateBeneficiaryDTO } from './beneficiary.dto';

@Controller('Trade')
@ApiBearerAuth('Authorization')
@ApiTags('Trade')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorizedException: Invalid credentials',
})
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('create-trade')
  @ApiOperation({ summary: 'Create user trade' })
  @ApiCreatedResponse({ description: 'Trade created successfully' })
  @ApiBadRequestResponse({ description: 'Failed to create trade' })
  @ApiResponse({
    status: 200,
    description: 'Create a trade',
  })
  async createTrade(@Res() res, @Req() req, @Body() tradeBody: CreateTradeDTO) {
    try {
      const userId = req.user.id;
      console.log("here is user's id", userId);
      const trade = await this.tradeService.createTrade(userId, tradeBody);
      return res.status(HttpStatus.CREATED).json({
        message: 'Trade created successfully',
        trade,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Failed to create trade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-all-trades')
  @ApiOperation({
    summary: 'Get all trades',
  })
  @ApiResponse({
    status: 200,
    description: 'List of trades',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get all trades',
  })
  async getAllTrades() {
    return await this.tradeService.findAll();
  }

  @Get('get-mine')
  @ApiOperation({
    summary: 'Get my trades',
  })
  @ApiResponse({
    status: 200,
    description: 'List my trades',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get my trades',
  })
  async getMine(@Req() req) {
    const userId: ObjectId = req.user.id;
    return await this.tradeService.findByUserId(userId);
  }

  @Get('get-all-except-mine')
  @ApiOperation({
    summary: 'Get others trades',
  })
  @ApiResponse({
    status: 200,
    description: 'List others trades',
  })
  @ApiBadRequestResponse({
    description: "Failed to get others' trades",
  })
  async getAllExceptMine(@Req() req) {
    const userId: ObjectId = req.user.id;
    return await this.tradeService.findAllExceptUser(userId);
  }

  @Get('get-trade/:tradeId')
  @ApiOperation({ summary: 'Get trade by Trade ID' })
  @ApiResponse({
    status: 200,
    description: 'Trade retrieved successfully',
  })
  @ApiBadRequestResponse({ description: 'Failed to get trade' })
  async getTradeByTradeId(@Param('tradeId') tradeId: string) {
    try {
      const trade = await this.tradeService.findTradeByTradeId(tradeId);
      return trade;
    } catch (error) {
      throw new NotFoundException(`Trade with Trade ID ${tradeId} not found`);
    }
  }

  @Post('create-beneficiary')
  @ApiOperation({ summary: 'Create a new beneficiary' })
  @ApiCreatedResponse({ description: 'Beneficiary created successfully' })
  @ApiBadRequestResponse({ description: 'Failed to create beneficiary' })
  async createBeneficiary(
    @Res() res,
    @Req() req,
    @Body() beneficiaryBody: CreateBeneficiaryDTO,
  ) {
    try {
      const userId = req.user.id;
      const beneficiary = await this.tradeService.createBeneficiary(
        userId,
        beneficiaryBody,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Beneficiary created successfully',
        beneficiary,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Failed to create beneficiary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-user-beneficiaries')
  @ApiOperation({ summary: 'Get all beneficiaries of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of user beneficiaries',
  })
  @ApiBadRequestResponse({ description: 'Failed to get beneficiaries' })
  async getUserBeneficiaries(@Req() req) {
    const userId = req.user.id;
    return await this.tradeService.getUserBeneficiaries(userId);
  }

  
}
