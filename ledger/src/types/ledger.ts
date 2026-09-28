export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'SGD'] as const

export type CurrencyCode = (typeof CURRENCIES)[number]

export type AccountBalance = {
  id: number
  name: string
  balanceUsd: number
}

export type LookupStatus = 'idle' | 'loading' | 'success' | 'not-found' | 'invalid' | 'error'

export type LookupResult = {
  status: LookupStatus
  account?: AccountBalance
  message?: string
}
