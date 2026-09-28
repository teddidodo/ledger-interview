import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ExchangeRate } from '../exchange-rates/exchange-rate.model'

@Injectable()
export class ExchangeRateRepository {
  constructor(
    @InjectModel(ExchangeRate)
    private readonly exchangeRateModel: typeof ExchangeRate,
  ) {}

  async findLatestByCurrency(currency: string): Promise<ExchangeRate | null> {
    return this.exchangeRateModel.findOne({
      where: { currency },
      order: [['rateDate', 'DESC']],
    })
  }
}
