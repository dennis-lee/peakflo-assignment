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
    await new Promise<void>((resolve, reject) => {
      if (req.file) {
        const filePath = req.file.path

        fs.createReadStream(filePath)
          .pipe(parse({ delimiter: ',', from_line: 2 }))
          .on('data', function (row) {
            console.log(row)
          })
          .on('end', function () {
            fs.promises.unlink(filePath)
            resolve()
          })
          .on('error', function (error) {
            reject(error)
          })
      } else {
        reject(new Error('CSV file not found'))
      }
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
