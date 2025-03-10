import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionFeeService } from './transaction-fee.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateTransactionFeeDTO,
  UpdateTransactionFeeDTO,
} from './transaction-fee.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { ObjectId } from 'mongoose';

@Controller('transaction-fee')
@ApiTags('Transaction fee')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
export class TransactionFeeController {
  constructor(private transactionFeeService: TransactionFeeService) {}
  @Get('get-all')
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

  @Post('create')
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
    @Req() req,
  ) {
    const id = req.user.id;

    return this.transactionFeeService.createTransactionFee(
      id,
      transactionFeeDTO,
    );
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a transaction fee' })
  @ApiParam({
    name: 'id',
    description: 'Id of the conversion fee',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction fee updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to update the transaction fee',
  })
  async updateTransactionFee(
    @Param('id') feeId: ObjectId,
    @Body() updateData: UpdateTransactionFeeDTO,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    try {
      const updatedFee = await this.transactionFeeService.updateTransactionFee(
        userId,
        feeId,
        updateData,
      );

      if (!updatedFee) {
        throw new NotFoundException('Transaction fee not found');
      }

      return { message: 'Successfully Updated', updatedFee };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a transaction fee' })
  @ApiParam({
    name: 'id',
    description: 'Id of the transaction fee',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction fee deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to delete the transaction fee',
  })
  async deleteTransactionFee(@Param('id') feeId: ObjectId, @Req() req: any) {
    const userId = req.user.id;

    try {
      const deletedFee = await this.transactionFeeService.deleteTransactionFee(
        feeId,
        userId,
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
