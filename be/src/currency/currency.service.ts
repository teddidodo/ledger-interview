import { BadRequestException, Injectable } from '@nestjs/common'
import { CURRENCY, isSupportedCurrency } from 'src/core/currency.enum'
import { ExchangeRateRepository } from './exchange-rate.repository'

@Injectable()
export class CurrencyService {
  constructor(
    private readonly exchangeRateRepository: ExchangeRateRepository,
  ) {}

  normalizeCurrency(currency?: string) {
    const code = (currency ?? 'USD').toUpperCase()
    if (!isSupportedCurrency(code)) {
      throw new BadRequestException(
        `Unsupported currency "${currency}". Supported: ${Object.values(CURRENCY).join(', ')}`,
      )
    }
    return code as CURRENCY
  }

  async convertFromUsd(balanceUsd: number, currency: CURRENCY) {
    if (currency === CURRENCY.USD) {
      return balanceUsd
    }
    const rate = await this.exchangeRateRepository.findLatestByCurrency(currency)

    const exchangeRate = Number(rate?.rate)
    if (!exchangeRate) {
      throw new BadRequestException(
        `No exchange rate for ${currency}`,
      )
    }

    return balanceUsd / exchangeRate
  }
}
