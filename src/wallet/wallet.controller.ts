import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletDTO, UpdateWalletDTO } from './wallet.dto';
import { ObjectId } from 'mongodb';
import { Wallet } from './wallet.schema';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { Types } from 'mongoose';

@ApiBearerAuth('Authorization')
@ApiTags('Wallet')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@ApiTags('Wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get wallet by ID' })
  @ApiParam({ name: 'id', description: 'Wallet ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Wallet retrieved successfully',
    type: Wallet,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async findOneById(@Param('id') id: ObjectId) {
    return this.walletService.findOneById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all wallets by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Wallets retrieved successfully',
    type: [Wallet],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getAllWalletsByUser(@Param('userId') userId: ObjectId) {
    return this.walletService.getAllWalletsByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiBody({ type: CreateWalletDTO })
  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully',
    type: Wallet,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createWallet(@Req() req, @Body() createWalletDTO: CreateWalletDTO) {
    const userId = req.user.id; // Assuming user ID is stored in request.user
    const walletData = { ...createWalletDTO, user: userId }; // Ensure the user field is set
    return this.walletService.createWallet(walletData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets for the signed-in user' })
  @ApiResponse({
    status: 200,
    description: 'Wallets retrieved successfully',
    type: [Wallet],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllWalletsForSignedInUser(@Req() req) {
    const userId = req.user.id; // Assuming user ID is stored in request.user
    const objectId = new Types.ObjectId(userId);
    return this.walletService.getAllWalletsByUser(objectId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing wallet' })
  @ApiParam({ name: 'id', description: 'Wallet ID', type: String })
  @ApiBody({ type: UpdateWalletDTO })
  @ApiResponse({
    status: 200,
    description: 'Wallet updated successfully',
    type: Wallet,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async updateWallet(
    @Param('id') id: ObjectId,
    @Body() updateWalletDTO: UpdateWalletDTO,
  ) {
    return this.walletService.updateWallet(id, updateWalletDTO);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete all wallets by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'Wallets deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAllWalletsByUser(@Param('userId') userId: ObjectId) {
    return this.walletService.deleteAllWalletsByUser(userId);
  }

  @Post('fund')
  @ApiOperation({ summary: 'Fund a wallet' })
  @ApiBody({ type: CreateWalletDTO })
  @ApiResponse({
    status: 200,
    description: 'Wallet funded successfully',
    type: Wallet,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async fundWallet(@Req() req, @Body() fundWalletDTO: CreateWalletDTO) {
    const userId = req.user.id; // Assuming user ID is stored in request.user
    return this.walletService.fundWallet(userId, fundWalletDTO);
  }
}
