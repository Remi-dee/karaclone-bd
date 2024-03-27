import { Controller, Body, Get, Post, Delete, Param } from '@nestjs/common';
import { currencyPair } from './currency-pair.model';
import { currencyPairService } from './currency-pair.service';

@Controller('superAdmin')
export class superAdminController {
  constructor(private readonly currencyPairService:  currencyPairService) {}

  @Get('currency-pairs')
  getAllPairs(): currencyPair[] {
    return this.currencyPairService.getAllPairs();
  }

  @Post('currency-pairs')
  addPair(@Body() currencyPair: currencyPair): void {
    this.currencyPairService.addPair(currencyPair);
  }

  @Delete('pair:/id')
  removePair(@Param('id') id: number): void {
    this.currencyPairService.removePair(id);
  }
}
