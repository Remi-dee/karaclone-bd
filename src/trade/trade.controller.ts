// transaction.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
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
}
