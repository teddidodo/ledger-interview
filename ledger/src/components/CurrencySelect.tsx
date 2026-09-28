import { CURRENCIES, type CurrencyCode } from '../types/ledger'

type CurrencySelectProps = {
  value: CurrencyCode
  onChange: (currency: CurrencyCode) => void
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <div className="currency-select">
      <label htmlFor="currency">Display currency</label>
      <select
        id="currency"
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyCode)}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  )
}
