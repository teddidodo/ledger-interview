import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { BalancesService } from './balances.service'

@Controller()
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('balance/:id')
  async getBalance(
    @Param('id', ParseIntPipe) id: number,
    @Query('currency') currency?: string,
  ) {
    return await this.balancesService.getBalanceById(id, currency)
  }

  @Get('total')
  async getTotal(@Query('currency') currency?: string) {
    return await this.balancesService.getTotal(currency)
  }
}
