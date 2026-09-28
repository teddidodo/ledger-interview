import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'exchange_rates',
  timestamps: false,
})
export class ExchangeRate extends Model {
  @PrimaryKey
  @Column({
    type: DataType.DATEONLY,
    field: 'rate_date',
  })
  declare rateDate: string

  @PrimaryKey
  @Column({
    type: DataType.STRING(3),
    allowNull: false,
  })
  declare currency: string

  @Column({
    type: DataType.DECIMAL(18, 8),
    allowNull: false,
  })
  declare rate: string
}
