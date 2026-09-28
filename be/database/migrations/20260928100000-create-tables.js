'use strict'

/** @type {import('umzug').MigrationFn<import('sequelize').QueryInterface>} */
async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS account_balances (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      balance_usd NUMERIC(18, 6) NOT NULL
    )
  `)

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS exchange_rates (
      rate_date DATE NOT NULL,
      currency VARCHAR(3) NOT NULL,
      rate NUMERIC(18, 8) NOT NULL,
      PRIMARY KEY (rate_date, currency)
    )
  `)

  await queryInterface.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency
      ON exchange_rates (currency)
  `)
}

/** @type {import('umzug').MigrationFn<import('sequelize').QueryInterface>} */
async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS exchange_rates')
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS account_balances')
}

module.exports = { up, down }
