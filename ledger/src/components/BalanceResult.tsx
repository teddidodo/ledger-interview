import { formatCurrency } from '../utils/currency'
import type { CurrencyCode, LookupResult } from '../types/ledger'

type BalanceResultProps = {
  result: LookupResult
  displayBalance: number | null
  currency: CurrencyCode
}

export function BalanceResult({ result, displayBalance, currency }: BalanceResultProps) {
  if (result.status === 'idle') {
    return (
      <div className="balance-result balance-result--idle" role="status">
        <p>Enter an account ID to view its balance.</p>
      </div>
    )
  }

  if (result.status === 'loading') {
    return (
      <div className="balance-result balance-result--loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Looking up account…</p>
      </div>
    )
  }

  if (result.status === 'invalid' || result.status === 'not-found' || result.status === 'error') {
    return (
      <div className="balance-result balance-result--error" role="alert">
        <p>{result.message}</p>
      </div>
    )
  }

  if (result.status !== 'success' || !result.account || displayBalance === null) {
    return null
  }

  const isNegative = displayBalance < 0

  return (
    <div className="balance-result balance-result--success">
      <div className="balance-result__header">
        <div>
          <p className="card__label">Account</p>
          <h2>{result.account.name}</h2>
        </div>
        <span className="account-id">ID {result.account.id}</span>
      </div>
      <p className={`balance-result__amount ${isNegative ? 'amount--negative' : ''}`}>
        {formatCurrency(displayBalance, currency)}
      </p>
      <p className="card__meta">Final balance in {currency}</p>
    </div>
  )
}
