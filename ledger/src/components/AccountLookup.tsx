import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { BalanceResult } from './BalanceResult'
import { useAccountLookup } from '../hooks/useAccountLookup'
import type { CurrencyCode } from '../types/ledger'

type AccountLookupProps = {
  currency: CurrencyCode
}

export function AccountLookup({ currency }: AccountLookupProps) {
  const [accountId, setAccountId] = useState('')
  const [searchedId, setSearchedId] = useState<string | null>(null)
  const { result, displayBalance, lookup, reset } = useAccountLookup(currency)

  useEffect(() => {
    if (searchedId !== null) {
      void lookup(searchedId)
      return
    }

    reset()
  }, [currency, searchedId, lookup, reset])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchedId(accountId)
  }

  return (
    <div className="lookup-card">
      <div className="lookup-card__header">
        <h2 id="account-lookup-heading">Account lookup</h2>
        <p className="card__meta">Search by account ID (100–999)</p>
      </div>

      <form className="lookup-form" onSubmit={handleSubmit}>
        <div className="lookup-form__field">
          <label htmlFor="account-id">Account ID</label>
          <input
            id="account-id"
            name="account-id"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 100"
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            autoComplete="off"
          />
        </div>
        <button type="submit" disabled={result.status === 'loading'}>
          {result.status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      <BalanceResult result={result} displayBalance={displayBalance} currency={currency} />
    </div>
  )
}
