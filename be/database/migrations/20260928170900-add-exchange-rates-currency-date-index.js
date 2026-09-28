'use strict'

/** @type {import('umzug').MigrationFn<import('sequelize').QueryInterface>} */
async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency_rate_date
      ON exchange_rates (currency, rate_date DESC)
  `)

  await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS idx_exchange_rates_currency
  `)
}

/** @type {import('umzug').MigrationFn<import('sequelize').QueryInterface>} */
async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency
      ON exchange_rates (currency)
  `)

  await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS idx_exchange_rates_currency_rate_date
  `)
}

module.exports = { up, down }
