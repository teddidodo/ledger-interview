import { useState } from 'react'
import { AccountLookup } from './components/AccountLookup'
import { CurrencySelect } from './components/CurrencySelect'
import { TotalBalanceCard } from './components/TotalBalanceCard'
import { useTotalBalance } from './hooks/useTotalBalance'
import type { CurrencyCode } from './types/ledger'
import './App.css'

function App() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const total = useTotalBalance(currency)

  return (
    <div className="app">
      <main className="dashboard">
        <section className="card dashboard-card">
          <div className="dashboard-card__toolbar">
            <h1>Ledger Dashboard</h1>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
          <TotalBalanceCard
            status={total.status}
            amount={total.amount}
            currency={currency}
            accountCount={total.accountCount}
            message={total.message}
          />
          <AccountLookup currency={currency} />
        </section>
      </main>
    </div>
  )
}

export default App
