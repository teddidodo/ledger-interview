export type IngestOptions = {
  transactionsPath: string
  exchangeRatesPath: string
  concurrency: number
}

export type TransactionRow = {
  id: number
  name: string
  plus: number
  minus: number
  currency: string
  date: string
}
