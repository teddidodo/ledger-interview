import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { QueryTypes, Sequelize } from 'sequelize'
import { runWithConcurrency } from './concurrency'
import { parseNumber, readCsvRows } from './csv'
import type { IngestOptions, TransactionRow } from './ingest.types'

type RateKey = `${string}|${string}`

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name)

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async run(options: IngestOptions): Promise<void> {
    const startedAt = Date.now()
    this.logger.log('Starting ingestion')

    const rates = await this.loadExchangeRates(options.exchangeRatesPath)
    const processedRows = await this.ingestTransactions(
      options.transactionsPath,
      rates,
      options.concurrency,
    )

    const elapsedMs = Date.now() - startedAt
    this.logger.log(
      `Ingestion complete: ${processedRows} transactions in ${elapsedMs}ms`,
    )
  }

  private async loadExchangeRates(filePath: string): Promise<Map<RateKey, number>> {
    const rates = new Map<RateKey, number>()
    const rows = await readCsvRows(filePath)

    for (const { columns, lineNumber } of rows) {
      if (columns.length < 3) {
        throw new Error(`Malformed exchange-rate row on line ${lineNumber}`)
      }

      const [date, currency, rateValue] = columns
      const rate = parseNumber(rateValue, 'rate', lineNumber)
      rates.set(`${date}|${currency}`, rate)

      await this.sequelize.query(
        `
          INSERT INTO exchange_rates (rate_date, currency, rate)
          VALUES (:date, :currency, :rate)
        `,
        {
          replacements: {
            date,
            currency,
            rate: rate.toFixed(8),
          },
          type: QueryTypes.INSERT,
        },
      )
    }

    this.logger.log(`Loaded ${rows.length} exchange-rate rows`)
    return rates
  }

  private async ingestTransactions(
    filePath: string,
    rates: Map<RateKey, number>,
    concurrency: number,
  ): Promise<number> {
    const rows = await readCsvRows(filePath)
    const transactions = rows.map(({ columns, lineNumber }) =>
      this.parseTransactionRow(columns, lineNumber),
    )

    let applied = 0
    await runWithConcurrency(transactions, concurrency, async (row) => {
      await this.applyTransaction(row, rates)
      applied += 1

      if (applied % 5000 === 0) {
        this.logger.log(`Applied ${applied} transactions…`)
      }
    })

    return transactions.length
  }

  private parseTransactionRow(columns: string[], lineNumber: number): TransactionRow {
    if (columns.length < 6) {
      throw new Error(`Malformed transaction row on line ${lineNumber}`)
    }

    const [idValue, name, plusValue, minusValue, currency, date] = columns

    return {
      id: parseNumber(idValue, 'id', lineNumber),
      name,
      plus: parseNumber(plusValue, 'plus', lineNumber),
      minus: parseNumber(minusValue, 'minus', lineNumber),
      currency,
      date,
    }
  }

  private async applyTransaction(
    row: TransactionRow,
    rates: Map<RateKey, number>,
  ): Promise<void> {
    const rate = rates.get(`${row.date}|${row.currency}`)
    if (rate === undefined) {
      throw new Error(
        `Missing exchange rate for ${row.currency} on ${row.date} (account ${row.id})`,
      )
    }

    const deltaUsd = row.plus * rate - row.minus * rate

    await this.sequelize.query(
      `
        INSERT INTO account_balances (id, name, balance_usd)
        VALUES (:id, :name, :deltaUsd)
        ON CONFLICT (id) DO UPDATE SET
          balance_usd = account_balances.balance_usd + EXCLUDED.balance_usd,
          name = EXCLUDED.name
      `,
      {
        replacements: {
          id: row.id,
          name: row.name,
          deltaUsd: deltaUsd.toFixed(6),
        },
        type: QueryTypes.INSERT,
      },
    )
  }
}
