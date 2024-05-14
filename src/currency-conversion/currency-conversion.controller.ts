import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyConversionService } from './currency-conversion.service';
import { CurrencyConversionDTO } from './currency-conversion.dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

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
}
