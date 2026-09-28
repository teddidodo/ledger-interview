import { formatCurrency } from '../utils/currency'
import type { CurrencyCode } from '../types/ledger'

type TotalBalanceCardProps = {
  status: 'loading' | 'ready' | 'error'
  amount: number | null
  currency: CurrencyCode
  accountCount: number | null
  message?: string
}

export function TotalBalanceCard({
  status,
  amount,
  currency,
  accountCount,
  message,
}: TotalBalanceCardProps) {
  const isNegative = amount !== null && amount < 0

  return (
    <div className="total-card">
      <p className="card__label" id="total-balance-heading">
        Total balance
      </p>
      {status === 'loading' ? (
        <p className="total-card__status" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading total…
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="total-card__status total-card__status--error" role="alert">
          {message ?? 'Could not load the total balance.'}
        </p>
      ) : null}
      {status === 'ready' && amount !== null && accountCount !== null ? (
        <>
          <p className={`total-card__amount ${isNegative ? 'amount--negative' : ''}`}>
            {formatCurrency(amount, currency)}
          </p>
          <p className="card__meta">
            Across {accountCount} accounts · shown in {currency}
          </p>
        </>
      ) : null}
    </div>
  )
}
