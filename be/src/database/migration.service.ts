import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { runMigrations } from './migrate'

@Injectable()
export class MigrationService implements OnModuleInit {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit(): Promise<void> {
    await runMigrations(this.sequelize)
  }
}
