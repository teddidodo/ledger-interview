import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { col, fn } from 'sequelize'
import { AccountBalance } from '../accounts/account-balance.model'

type BalanceAggregate = {
  total: string | null
  count: string
}

@Injectable()
export class BalanceRepository {
  constructor(
    @InjectModel(AccountBalance)
    private readonly accountBalanceModel: typeof AccountBalance,
  ) {}

  async findById(id: number): Promise<AccountBalance | null> {
    return this.accountBalanceModel.findByPk(id)
  }

  async getTotal(): Promise<{ totalUsd: number; accountCount: number }> {
    const result = (await this.accountBalanceModel.findOne({
      attributes: [
        [fn('SUM', col('balance_usd')), 'total'],
        [fn('COUNT', col('id')), 'count'],
      ],
      raw: true,
    })) as unknown as BalanceAggregate | null

    return {
      totalUsd: Number(result?.total) || 0,
      accountCount: Number(result?.count) || 0,
    }
  }
}