import { useCallback, useRef, useState } from 'react'
import { ApiError, fetchAccountBalance } from '../api/balances'
import type { AccountBalance, CurrencyCode, LookupResult } from '../types/ledger'

const MIN_ACCOUNT_ID = 100
const MAX_ACCOUNT_ID = 999

function validateAccountId(raw: string): number | null {
  const trimmed = raw.trim()
  if (!/^\d+$/.test(trimmed)) {
    return null
  }

  const id = Number.parseInt(trimmed, 10)
  if (id < MIN_ACCOUNT_ID || id > MAX_ACCOUNT_ID) {
    return null
  }

  return id
}

export function useAccountLookup(currency: CurrencyCode) {
  const [result, setResult] = useState<LookupResult>({ status: 'idle' })
  const [displayBalance, setDisplayBalance] = useState<number | null>(null)
  const requestId = useRef(0)

  const lookup = useCallback(
    async (rawId: string) => {
      const id = validateAccountId(rawId)
      if (id === null) {
        requestId.current += 1
        setResult({
          status: 'invalid',
          message: `Enter a valid account ID between ${MIN_ACCOUNT_ID} and ${MAX_ACCOUNT_ID}.`,
        })
        setDisplayBalance(null)
        return
      }

      const currentRequest = ++requestId.current
      setResult({ status: 'loading' })
      setDisplayBalance(null)

      try {
        const response = await fetchAccountBalance(id, currency)
        if (currentRequest !== requestId.current) {
          return
        }

        setResult({
          status: 'success',
          account: {
            id: response.id,
            name: response.name,
            balanceUsd: response.balanceUsd,
          },
        })
        setDisplayBalance(response.balance)
      } catch (error) {
        if (currentRequest !== requestId.current) {
          return
        }

        setDisplayBalance(null)

        if (error instanceof ApiError && error.status === 404) {
          setResult({
            status: 'not-found',
            message: `No account found for ID ${id}.`,
          })
          return
        }

        setResult({
          status: 'error',
          message: 'Could not load this account. Check that the API is running.',
        })
      }
    },
    [currency],
  )

  const reset = useCallback(() => {
    requestId.current += 1
    setResult({ status: 'idle' })
    setDisplayBalance(null)
  }, [])

  return {
    result,
    displayBalance,
    lookup,
    reset,
  }
}

export type AccountLookupState = {
  result: LookupResult
  displayBalance: number | null
  account?: AccountBalance
}
