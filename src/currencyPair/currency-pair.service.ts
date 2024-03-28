import { Injectable } from '@nestjs/common';
import { currencyPair } from './currency-pair.model';

@Injectable()
export class currencyPairService {
  private currencyPairs: currencyPair[] = [];

  getAllPairs(): currencyPair[] {
    return this.currencyPairs;
  }

  addPair(pair: currencyPair): void {
    this.currencyPairs.push(pair);
  }

  removePair(id: number): void {
    this.currencyPairs = this.currencyPairs.filter((pair) => pair.id !== id);
  }
}
