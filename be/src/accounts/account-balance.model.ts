import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  tableName: 'account_balances',
  timestamps: false,
})
export class AccountBalance extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string

  @Column({
    type: DataType.DECIMAL(18, 6),
    allowNull: false,
    field: 'balance_usd',
  })
  declare balanceUsd: string
}
