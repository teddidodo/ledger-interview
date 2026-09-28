import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { IngestAppModule } from './ingest.module'
import { IngestService } from './ingest.service'
import type { IngestOptions } from './ingest.types'

function parseArgs(argv: string[]): IngestOptions {
  const args = new Map<string, string>()

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      continue
    }

    const key = token.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`)
    }

    args.set(key, value)
    index += 1
  }

  const transactionsPath = args.get('transactions')
  const exchangeRatesPath = args.get('rates')

  if (!transactionsPath || !exchangeRatesPath) {
    throw new Error(
      'Usage: npm run ingest -- --transactions <path> --rates <path> [--concurrency 64]',
    )
  }

  const concurrency = Number(args.get('concurrency') ?? 64)
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error('Concurrency must be a positive integer')
  }

  return { transactionsPath, exchangeRatesPath, concurrency }
}

async function bootstrap() {
  const logger = new Logger('IngestMain')
  const options = parseArgs(process.argv.slice(2))
  const app = await NestFactory.createApplicationContext(
    IngestAppModule.register(options.concurrency),
    {
      logger: ['error', 'warn', 'log'],
    },
  )

  try {
    const ingestService = app.get(IngestService)
    await ingestService.run(options)
    logger.log('Ingest process finished — start the read server separately')
  } finally {
    await app.close()
  }
}

void bootstrap().catch((error: Error) => {
  console.error(error.message)
  process.exit(1)
})
