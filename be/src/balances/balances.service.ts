import { Injectable, NotFoundException } from '@nestjs/common'
import { CurrencyService } from '../currency/currency.service'
import { BalanceRepository } from './balance.repository'

@Injectable()
export class BalancesService {
  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly currencyService: CurrencyService,
  ) {}

  async getBalanceById(id: number, currencyInput?: string) {
    const currency = this.currencyService.normalizeCurrency(currencyInput)
    const account = await this.balanceRepository.findById(id)

    if (!account) {
      throw new NotFoundException(`Account ${id} not found`)
    }

    const balanceUsd = Number(account.balanceUsd)
    const balance = await this.currencyService.convertFromUsd(balanceUsd, currency)

    return {
      id: account.id,
      name: account.name,
      currency,
      balance,
      balanceUsd,
    }
  }

  async getTotal(currencyInput?: string) {
    const currency = this.currencyService.normalizeCurrency(currencyInput)
    const { totalUsd, accountCount } = await this.balanceRepository.getTotal()
    const total = await this.currencyService.convertFromUsd(totalUsd, currency)

    return {
      currency,
      total,
      totalUsd,
      accountCount,
    }
  }
}
