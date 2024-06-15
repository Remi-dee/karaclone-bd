import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TrueLayerService } from './truelayer.service';
import { PaymentRequestDTO } from './truelayer.dto';

@Controller('truelayer')
export class TrueLayerController {
  constructor(private readonly trueLayerService: TrueLayerService) {}

  @Post('payments/initiate')
  @ApiOperation({ summary: 'Initiate payment with TrueLayer' })
  @ApiBody({
    description: 'Initiate payment data',
    type: PaymentRequestDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment initiation completed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: An error occurred during payment initiation',
  })
  async initiatePayment(@Body() body: PaymentRequestDTO, @Res() res) {
    try {
      const result = await this.trueLayerService.initiatePayment(body);
      return res.status(HttpStatus.OK).json({
        message: 'Payment initiation completed successfully',
        data: result,
      });
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
