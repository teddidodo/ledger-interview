export enum CURRENCY {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  SGD = 'SGD',
}

export function isSupportedCurrency(currency: string): boolean {
  return Object.values(CURRENCY).includes(
    currency.toUpperCase() as CURRENCY,
  )
}

export function supportCurrency() {
  return Object.values(CURRENCY).join(', ')
}