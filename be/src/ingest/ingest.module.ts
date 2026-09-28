import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '../database/database.module'
import { IngestService } from './ingest.service'

@Module({})
export class IngestAppModule {
  static register(poolMax: number): DynamicModule {
    return {
      module: IngestAppModule,
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule.forRoot(poolMax)],
      providers: [IngestService],
      exports: [IngestService],
    }
  }
}
