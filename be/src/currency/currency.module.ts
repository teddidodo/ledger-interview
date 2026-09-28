import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ExchangeRate } from '../exchange-rates/exchange-rate.model'
import { CurrencyService } from './currency.service'
import { ExchangeRateRepository } from './exchange-rate.repository'

@Module({
  imports: [SequelizeModule.forFeature([ExchangeRate])],
  providers: [CurrencyService, ExchangeRateRepository],
  exports: [CurrencyService],
})
export class CurrencyModule {}
