import { Logger } from './tools/logger'
import express from 'express'
import 'dotenv/config'

import v1Router from './api/v1/router'

void main()

function main() {
  const logger = Logger.create()
  logger.info('Initializing server')

  const server = express()

  server.use('/api/v1', v1Router)

  server.listen(process.env.SERVER_PORT, () => {
    logger.info(`Server running on port ${process.env.SERVER_PORT}`)
  })
}
