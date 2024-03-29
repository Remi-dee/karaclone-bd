import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { TransactionFeeService } from './transaction-fee.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateTransactionFeeDTO,
  UpdateTransactionFeeDTO,
} from './transaction-fee.dto';

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
    // @Res() res,
    // @Req() req,
  ) {
    // const id = req.user.id;

    return this.transactionFeeService.createTransactionFee(
      //   id,
      transactionFeeDTO,
    );
  }

  @Put('update-transaction-fee')
  @ApiOperation({ summary: 'Update a transaction fee' })
  @ApiResponse({
    status: 200,
    description: 'Transaction fee updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to update the transaction fee',
  })
  async updateTransactionFee(
    @Body() updateData: UpdateTransactionFeeDTO,
    // @Req() req,
  ) {
    const feeId = updateData.feeId;
    // const userId = req.user.id;

    try {
      const updatedFee = await this.transactionFeeService.updateTransactionFee(
        // userId,
        feeId,
        updateData,
      );

      if (!updatedFee) {
        throw new NotFoundException('Transaction fee not found');
      }

      return updatedFee;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('delete-transaction-fee')
  @ApiOperation({ summary: 'Delete a transaction fee' })
  @ApiResponse({
    status: 200,
    description: 'Transaction fee deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to delete the transaction fee',
  })
  async deleteTransactionFee(@Req() req) {
    const { feeId } = req.body; // Extract feeId from request body
    // const userId = req.user.id; // Get user ID from request

    try {
      const deletedFee = await this.transactionFeeService.deleteTransactionFee(
        feeId,
        // userId,
      );

      if (!deletedFee) {
        throw new NotFoundException('Transaction fee not found');
      }

      return deletedFee;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
