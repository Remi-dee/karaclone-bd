import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { TransactionService } from './transaction.service';

@ApiBearerAuth('Authorization')
@ApiTags('Transaction')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post('fund-wallet')
  // @ApiOperation({
  //   summary: 'Fund user wallet',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Fund user wallet',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Failed to fund user wallet',
  // })
  // @ApiUnauthorizedResponse({
  //   description: 'UnauthorisedException: Invalid credentials',
  // })
  // async fundUserWallet(
  //   @Res() res,
  //   @Req() req,
  //   @Body() fundWalletBody: FundWalletDTO,
  // ) {
  //   try {
  //     const id = req.user.id;
  //     const fundWallet = await this.transactionService.fundWalletService(
  //       id,
  //       fundWalletBody,
  //     );
  //     return res.status(HttpStatus.CREATED).json({
  //       message: 'Your wallet is funded successful',
  //       fundWallet,
  //     });
  //   } catch (error) {
  //     if (error instanceof ErrorHandler) {
  //       // Handle the "not found" exception
  //       return res.status(HttpStatus.NOT_FOUND).json({
  //         message: error.message, // Send the error message to the client
  //       });
  //     } else {
  //       Logger.error(error);
  //       throw new HttpException(
  //         'Something went wrong, please try again later',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
  // }
}
