import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BalancesModule } from './balances/balances.module'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule.forRoot(), 
    BalancesModule
  ]
})
export class AppModule {}
