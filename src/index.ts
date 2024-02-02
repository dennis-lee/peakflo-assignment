import logger from './tools/logger'
import express from 'express'
import 'dotenv/config'

void main()

function main() {
  logger.info('Initializing server')

  const server = express()

  server.listen(process.env.SERVER_PORT, () => {
    logger.info(`Server running on port ${process.env.SERVER_PORT}`)
  })
}
