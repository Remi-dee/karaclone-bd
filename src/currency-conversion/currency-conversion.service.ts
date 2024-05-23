import { Injectable } from '@nestjs/common';
import { CurrencyPairService } from 'src/currencyPair/currency-pair.service';

@Injectable()
export class CurrencyConversionService {
  constructor(private readonly currencyPairService: CurrencyPairService) {}

  async convertCurrency(
    amount: number,
    sourceCurrency: string,
    targetCurrency: string,
  ): Promise<number> {
    const exchangeRate = await this.currencyPairService.getExchangeRate(
      sourceCurrency,
      targetCurrency,
    );
    const convertedAmount = amount * exchangeRate;
    return convertedAmount;
  }
}
