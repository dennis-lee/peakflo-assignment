import express from 'express'
import pino from 'pino'
import fs from 'fs'
import { parse } from 'csv-parse'
import { ITravelService } from './service'

type UserTravelHistory = {
  FromLine: string
  ToLine: string
  DateTime: string
}

export interface ITravelController {
  calculateFaresFromCsv(
    req: express.Request,
    res: express.Response
  ): Promise<void>
}

export class TravelController {
  constructor(
    protected readonly logger: pino.Logger,
    readonly travelService: ITravelService
  ) {}

  async calculateFaresFromCsv(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    await new Promise<UserTravelHistory[]>((resolve, reject) => {
      const data = new Array<UserTravelHistory>()

      if (req.file) {
        const filePath = req.file.path

        fs.createReadStream(filePath)
          .pipe(parse({ columns: true, delimiter: ',' }))
          .on('data', function (row: UserTravelHistory) {
            data.push(row)
          })
          .on('end', function () {
            fs.promises.unlink(filePath)
            resolve(data)
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
        if (response) {
          response.forEach((row) => {
            this.travelService.calculateFareBetweenTwoLines(
              row.FromLine,
              row.ToLine,
              new Date(row.DateTime)
            )
          })
        }

        res.status(200).end()
      })
  }
}
