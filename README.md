# Ledger

## 1. Start the stack

```bash
docker compose up --build -d
```

Dashboard: http://localhost:5173

## 2. Run migrations

```bash
cd be
npm install
npm run db:migrate
```

## 3. Ingest the files

Note: Run only one time

```bash
cd be
npm run ingest -- --transactions ../data/transactions.csv --rates ../data/exchange-rates.csv --concurrency 32
```
