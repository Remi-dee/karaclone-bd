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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TrueLayerService } from './truelayer.service';
import { GenerateHeadersDTO, PaymentRequestDTO } from './truelayer.dto';

@ApiTags('Truelayer')
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
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
      console.log('this is controller', error);

      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Generate headers for TrueLayer API' })
  @ApiResponse({ status: 200, description: 'Headers generated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('generate-headers')
  async generateHeaders(
    @Body() generateHeadersDto: GenerateHeadersDTO,
  ): Promise<Record<string, string>> {
    try {
      const headers = await this.trueLayerService.generateHeaders(
        generateHeadersDto.path,
        generateHeadersDto.method,
        JSON.parse(generateHeadersDto.body),
      );
      return headers;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to generate headers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
