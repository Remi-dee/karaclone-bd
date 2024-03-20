import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import ErrorHandler from '../utils/ErrorHandler';

@ApiBearerAuth('Authorization')
@ApiTags('Wallet')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('get-all-user-wallets')
  @ApiOperation({
    summary: 'Get all user wallets',
  })
  @ApiResponse({
    status: 200,
    description: 'All wallets for a user',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get all wallets for a user',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async getUserWallets(@Res() res, @Req() req) {
    try {
      const id = req.user.id;
      const result = await this.walletService.getAllWalletsByUser(id);
      return res.status(HttpStatus.CREATED).json({
        message: 'User wallets retrieved successfully!',
        result,
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        // Handle the "not found" exception
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message, // Send the error message to the client
        });
      } else {
        Logger.error(error);
        throw new HttpException(
          'Something went wrong, please try again later',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
