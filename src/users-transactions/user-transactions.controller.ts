// user-transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  Res,
  Query,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserTransaction } from './user-transactions.schema';
import { UserTransactionsService } from './user-transactions.service';
import {
  CreateUserTransactionDto,
  UpdateUserTransactionDto,
} from './user-transactions.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

@ApiTags('User-transactions')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller('user-transactions')
export class UserTransactionsController {
  constructor(
    private readonly userTransactionsService: UserTransactionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createTransactionDto: CreateUserTransactionDto,
    @Request() req: any,
    @Res() res: any,
  ): Promise<UserTransaction> {
    createTransactionDto.user_id = req.user.id;

    return res.status(HttpStatus.OK).json({
      message: 'Transaction created successfully',
      transaction:
        await this.userTransactionsService.create(createTransactionDto),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved transactions.',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res: any,
    @Req() req: any,
  ): Promise<any> {
    const user_id = req.user.id;
    const { transactions, totalItems } =
      await this.userTransactionsService.findAll(
        user_id,
        Number(page),
        Number(limit),
      );
    console.log('our user id', user_id);
    return res.status(HttpStatus.OK).json({
      message: 'Transactions retrieved successfully',
      transactions,
      totalItems,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved transaction.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async findOne(
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<UserTransaction> {
    const transaction = await this.userTransactionsService.findOne(id);
    return res.status(HttpStatus.OK).json({
      message: 'Transaction retreived successfully',
      transaction,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated transaction.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateUserTransactionDto,
    @Res() res: any,
  ): Promise<UserTransaction> {
    const updateTransaction = await this.userTransactionsService.update(
      id,
      updateTransactionDto,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Transaction updated successfully',
      updateTransaction,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted transaction.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async remove(@Param('id') id: string): Promise<UserTransaction> {
    return await this.userTransactionsService.remove(id);
  }

  @Post('drop-index')
  @ApiOperation({ summary: 'Drop the unique index on beneficiary_account' })
  async dropIndex(): Promise<void> {
    await this.userTransactionsService.dropBeneficiaryAccountIndex();
  }
}
