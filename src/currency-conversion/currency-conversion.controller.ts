import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
  Res,
} from '@nestjs/common';
import { CurrencyConversionService } from './currency-conversion.service';
import {
  CurrencyConversionDTO,
  ExchangeRateDTO,
} from './currency-conversion.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import ErrorHandler from 'src/utils/ErrorHandler';

@ApiTags('Currency-conversion')
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('currency-conversion')
export class CurrencyConversionController {
  constructor(
    private readonly currencyConversionService: CurrencyConversionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Convert currency',
  })
  async convertCurrency(
    @Query() query: CurrencyConversionDTO,
  ): Promise<number> {
    const { amount, sourceCurrency, targetCurrency } = query;
    return this.currencyConversionService.convertCurrency(
      amount,
      sourceCurrency,
      targetCurrency,
    );
  }

  @Get('exchange-rate')
  @ApiOperation({
    summary: 'Get exchange rate',
  })
  @ApiResponse({
    status: 200,
    description: 'Exchange rate retrieved successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to get exchange rate',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async getExchangeRate(@Res() res, @Query() query: ExchangeRateDTO) {
    try {
      console.log(query);

      const { baseCurrency, quoteCurrency } = query;
      console.log('currency', baseCurrency, quoteCurrency);
      const exchangeRate = await this.currencyConversionService.getExchangeRate(
        baseCurrency,
        quoteCurrency,
      );

      return res.status(200).json({
        message: 'Exchange rate retrieved successfully',
        exchangeRate,
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
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
