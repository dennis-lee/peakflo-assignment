import { Logger } from './tools/logger'
import express from 'express'
import 'dotenv/config'

import v1Router from './api/v1/router'
import { DataSource } from 'typeorm'
import GracefulShutdown from 'http-graceful-shutdown'

void main()

async function main() {
  const logger = Logger.create()
  logger.info('Initializing server')

  const server = express()

  const db = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  })

  try {
    await db
      .initialize()
      .then(() => {
        logger.info('Connected to database')
      })
      .catch((error) => {
        throw error
      })

    server.use('/api/v1', v1Router)

    server.listen(process.env.SERVER_PORT, () => {
      logger.info(`Server running on port ${process.env.SERVER_PORT}`)
    })
  } catch (e) {
    logger.error(e as Error)
    process.exit(1)
  }

  GracefulShutdown(server, {
    onShutdown: async () => {
      logger.info('Closing connections')
      await Promise.all([db.destroy()])
    },
    finally: () => {
      logger.info('Server shutdown gracefully')
    },
  })
}
