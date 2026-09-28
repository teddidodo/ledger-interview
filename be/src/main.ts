import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  })

  const port = Number(process.env.PORT ?? 3001)
  await app.listen(port)
  console.log(`Ledger read server listening on http://localhost:${port}/api`)
}

void bootstrap()
