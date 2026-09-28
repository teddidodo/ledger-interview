import { useEffect, useState } from 'react'
import { fetchTotalBalance } from '../api/balances'
import type { CurrencyCode } from '../types/ledger'

type LoadedTotal = {
  amount: number | null
  accountCount: number | null
  loadedCurrency: CurrencyCode | null
  error: string | null
}

type TotalBalanceState = {
  status: 'loading' | 'ready' | 'error'
  amount: number | null
  accountCount: number | null
  message?: string
}

export function useTotalBalance(currency: CurrencyCode): TotalBalanceState {
  const [loaded, setLoaded] = useState<LoadedTotal>({
    amount: null,
    accountCount: null,
    loadedCurrency: null,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchTotalBalance(currency, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return
        }

        setLoaded({
          amount: response.total,
          accountCount: response.accountCount,
          loadedCurrency: currency,
          error: null,
        })
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return
        }

        setLoaded({
          amount: null,
          accountCount: null,
          loadedCurrency: currency,
          error: 'Could not load the total balance.',
        })
      })

    return () => controller.abort()
  }, [currency])

  if (loaded.loadedCurrency !== currency) {
    return {
      status: 'loading',
      amount: null,
      accountCount: null,
    }
  }

  if (loaded.error) {
    return {
      status: 'error',
      amount: null,
      accountCount: null,
      message: loaded.error,
    }
  }

  return {
    status: 'ready',
    amount: loaded.amount,
    accountCount: loaded.accountCount,
  }
}
