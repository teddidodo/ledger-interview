import type { CurrencyCode } from '../types/ledger'

export type AccountBalanceResponse = {
  id: number
  name: string
  currency: CurrencyCode
  balance: number
  balanceUsd: number
}

export type TotalBalanceResponse = {
  currency: CurrencyCode
  total: number
  totalUsd: number
  accountCount: number
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function fetchAccountBalance(
  id: number,
  currency: CurrencyCode,
  signal?: AbortSignal,
): Promise<AccountBalanceResponse> {
  const params = new URLSearchParams({ currency })
  return request<AccountBalanceResponse>(`/api/balance/${id}?${params}`, signal)
}

export function fetchTotalBalance(
  currency: CurrencyCode,
  signal?: AbortSignal,
): Promise<TotalBalanceResponse> {
  const params = new URLSearchParams({ currency })
  return request<TotalBalanceResponse>(`/api/total?${params}`, signal)
}
