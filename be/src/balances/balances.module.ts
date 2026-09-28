import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccountBalance } from '../accounts/account-balance.model'
import { CurrencyModule } from '../currency/currency.module'
import { BalancesController } from './balances.controller'
import { BalancesService } from './balances.service'
import { BalanceRepository } from './balance.repository'

@Module({
  imports: [
    SequelizeModule.forFeature([AccountBalance]), 
    CurrencyModule
  ],
  controllers: [BalancesController],
  providers: [BalancesService, BalanceRepository],
})
export class BalancesModule {}
