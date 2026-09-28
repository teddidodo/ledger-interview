import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccountBalance } from '../accounts/account-balance.model'
import { ExchangeRate } from '../exchange-rates/exchange-rate.model'
import { MigrationService } from './migration.service'

const READ_SERVER_POOL_MAX = 5

@Module({})
export class DatabaseModule {
  static forRoot(poolMax = READ_SERVER_POOL_MAX): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            dialect: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get<string>('DB_USER', 'ledger'),
            password: config.get<string>('DB_PASSWORD', 'ledger'),
            database: config.get<string>('DB_NAME', 'ledger'),
            models: [AccountBalance, ExchangeRate],
            autoLoadModels: true,
            synchronize: false,
            logging: false,
            pool: {
              max: poolMax,
            },
          }),
        }),
      ],
      providers: [MigrationService],
    }
  }
}
