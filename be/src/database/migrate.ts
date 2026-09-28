import { join } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { Sequelize } from 'sequelize'
import { SequelizeStorage, Umzug } from 'umzug'

function createUmzug(sequelize: Sequelize) {
  return new Umzug({
    migrations: {
      glob: ['*.js', { cwd: join(__dirname, '..', '..', 'database', 'migrations') }],
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  })
}

export async function runMigrations(sequelize: Sequelize): Promise<void> {
  await createUmzug(sequelize).up()
}

export async function undoLastMigration(sequelize: Sequelize): Promise<void> {
  await createUmzug(sequelize).down()
}

function createSequelize(): Sequelize {
  loadEnv({ quiet: true })

  return new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'ledger',
    password: process.env.DB_PASSWORD ?? 'ledger',
    database: process.env.DB_NAME ?? 'ledger',
    logging: false,
  })
}

async function main(): Promise<void> {
  const sequelize = createSequelize()

  try {
    if (process.argv.includes('--undo')) {
      await undoLastMigration(sequelize)
      return
    }

    await runMigrations(sequelize)
  } finally {
    await sequelize.close()
  }
}

if (require.main === module) {
  void main()
}
