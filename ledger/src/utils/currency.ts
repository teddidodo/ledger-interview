import type { CurrencyCode } from '../types/ledger'

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
