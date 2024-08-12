// transaction.controller.ts

import {
  Body,
  Controller,
  Delete,
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
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { TradeService } from './trade.service';
import { BuyTradeDTO, CreateTradeDTO } from './trade.dto';
import { ObjectId } from 'mongoose';
import { CreateBeneficiaryDTO } from './beneficiary.dto';
import { BuyTrade } from './trade.schema';

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

  @Delete('delete-all-trades')
  @ApiOperation({ summary: 'Delete all trades' })
  @ApiCreatedResponse({ description: 'Trades deleted successfully' })
  @ApiBadRequestResponse({ description: 'Failed to delete trades' })
  @ApiResponse({
    status: 200,
    description: 'Delete all trades',
  })
  async deleteAllTrades() {
    return await this.tradeService.deleteAllTrades();
  }

  @Delete('delete-a-trade/:tradeId')
  @ApiOperation({ summary: 'Delete a trade' })
  @ApiCreatedResponse({ description: 'Trade deleted successfully' })
  @ApiBadRequestResponse({ description: 'Failed to delete a trade' })
  @ApiResponse({
    status: 200,
    description: 'Delete a trade',
  })
  async deleteTradeById(@Param('tradeId') tradeId: string) {
    return await this.tradeService.deleteTradeById(tradeId);
  }

  @ApiOperation({ summary: 'Delete trades by user ID' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'The ID of the user whose trades to delete',
  })
  @ApiResponse({ status: 200, description: 'Trades deleted successfully.' })
  @Delete('delete-my-trades/user/:userId')
  async deleteTradesByUserId(@Param('userId') userId: string, @Res() res) {
    const result = await this.tradeService.deleteTradesByUserId(userId);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({ summary: 'Delete trades for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Trades deleted successfully.' })
  @Delete('delete-my-trades/user/')
  async deleteMyTrades(@Req() req, @Res() res) {
    const userId = req.user.id;
    const result = await this.tradeService.deleteTradesByUserId(userId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('buy-trade')
  @ApiOperation({ summary: 'Buy a trade' })
  @ApiCreatedResponse({ description: 'Trade bought successfully' })
  @ApiBadRequestResponse({ description: 'Failed to buy a trade' })
  async buyTrade(@Res() res, @Req() req, @Body() buyTradeBody: BuyTradeDTO) {
    try {
      console.log('here is buy', buyTradeBody);
      const userId = req.user.id;
      const trade = await this.tradeService.buyTrade(userId, buyTradeBody);
      return res.status(HttpStatus.OK).json({
        message: 'Trade bought successfully',
        trade,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Failed to buy trade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('bought-trades')
  @ApiOperation({ summary: 'Get all bought trades' })
  @ApiResponse({
    status: 200,
    description: 'List of all bought trades',
    type: [BuyTrade],
  })
  async getAllBoughtTrades() {
    return await this.tradeService.getAllBoughtTrades();
  }

  @Get('bought-trade/:id')
  @ApiOperation({ summary: 'Get a single bought trade by ID' })
  @ApiParam({ name: 'id', description: 'ID of the bought trade' })
  @ApiResponse({
    status: 200,
    description: 'Bought trade found',
    type: BuyTrade,
  })
  @ApiResponse({ status: 404, description: 'Trade not found' })
  async getBoughtTrade(@Param('id') id: string) {
    return await this.tradeService.getBoughtTrade(id);
  }

  @Get('my-bought-trades')
  @ApiOperation({ summary: 'Get all bought trades for the signed-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of all bought trades for the signed-in user',
    type: [BuyTrade],
  })
  async getUserBoughtTrades(@Req() req, @Res() res) {
    try {
      const userId = req.user.id; // Retrieve user ID from request context
      const userBoughtTrades =
        await this.tradeService.getUserBoughtTrades(userId);
      return res.status(HttpStatus.OK).json(userBoughtTrades);
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch user bought trades',
        error: error.message,
      });
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

  @Delete('delete-beneficiary/:id')
  @ApiOperation({ summary: 'Delete a beneficiary by ID' })
  @ApiResponse({
    status: 200,
    description: 'Beneficiary deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Beneficiary not found' })
  @ApiBadRequestResponse({ description: 'Failed to delete beneficiary' })
  async deleteBeneficiary(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const userId = req.user.id;
      const beneficiary = await this.tradeService.deleteBeneficiaryById(
        id,
        userId,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Beneficiary deleted successfully',
        beneficiary,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Failed to delete beneficiary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete-all-beneficiaries')
  @ApiOperation({ summary: 'Delete all beneficiaries of the user' })
  @ApiResponse({
    status: 200,
    description: 'All beneficiaries deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Failed to delete beneficiaries' })
  async deleteAllBeneficiaries(@Req() req, @Res() res) {
    try {
      const userId = req.user.id;
      const result = await this.tradeService.deleteAllBeneficiaries(userId);
      return res.status(HttpStatus.OK).json({
        message: 'All beneficiaries deleted successfully',
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Failed to delete beneficiaries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('drop-index')
  async dropIndex(): Promise<string> {
    await this.tradeService.dropTradeIdIndex();
    return 'Index dropped successfully';
  }

  @Get('drop-indexes')
  async dropIndexes(): Promise<string> {
    await this.tradeService.dropIndexes();
    return 'Indexes dropped successfully';
  }

  @Get('list-indexes')
  async listIndexes(): Promise<string> {
    await this.tradeService.listIndexes();
    return 'Indexes listed in console';
  }
}
