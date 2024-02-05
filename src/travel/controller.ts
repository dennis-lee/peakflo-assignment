import express from 'express'
import pino from 'pino'
import fs from 'fs'
import { parse } from 'csv-parse'

export class TravelController {
  constructor(protected readonly logger: pino.Logger) {}

  async calculateFaresFromCsv(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!req.file) {
      this.logger.error('CSV file not found')
      res.status(500).end()
    }

    await new Promise<void>((resolve, reject) => {
      const filePath = req.file!.path

      fs.createReadStream(filePath)
        .pipe(parse({ delimiter: ',', from_line: 2 }))
        .on('data', function (row) {
          console.log(row)
        })
        .on('end', function () {
          fs.unlink(filePath, (error) => {
            // Ignore unlinking errors
          })
          resolve()
        })
        .on('error', function (error) {
          reject(error)
        })
    })
      .catch((e) => {
        this.logger.error(e)
        res.status(500).end()
      })
      .then((response) => {
        res.status(200).end()
      })
  }
}
