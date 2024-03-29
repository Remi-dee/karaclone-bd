import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { TransactionFeeService } from './transaction-fee.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTransactionFeeDTO } from './transaction-fee.dto';

@Controller('transaction-fee')
export class TransactionFeeController {
  constructor(private transactionFeeService: TransactionFeeService) {}
  @Get('get-all-transaction-fee')
  @ApiOperation({
    summary: 'Get all transaction fees',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transaction fees',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get all transaction fees',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorizedException: Invalid credentials',
  })
  async getAllTransactionFee() {
    return this.transactionFeeService.findAll();
  }

  @Post('create-transaction-fee')
  @ApiOperation({ summary: 'Create a transaction fee' })
  @ApiResponse({
    status: 201,
    description: 'Transaction fee created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to create a transaction fee',
  })
  async createTransactionFee(
    @Body() transactionFeeDTO: CreateTransactionFeeDTO,
    @Res() res,
    @Req() req,
  ) {
    const id = req.user.id;

    return this.transactionFeeService.createTransactionFee(
      id,
      transactionFeeDTO,
    );
  }


  
}
