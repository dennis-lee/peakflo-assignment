import express from 'express'
import pino from 'pino'
import fs from 'fs'
import { parse } from 'csv-parse'
import { ITravelService } from './service'
import { IControllerResult } from '../api/v1/router'

export type UserTravelHistory = {
  FromLine: string
  ToLine: string
  DateTime: string
}

export interface ITravelController {
  calculateFaresFromCsv(req: express.Request): Promise<IControllerResult>
}

export class TravelController {
  constructor(protected readonly logger: pino.Logger, readonly travelService: ITravelService) {}

  async calculateFaresFromCsv(req: express.Request): Promise<IControllerResult> {
    const data = new Array<UserTravelHistory>()

    let errMsg = ''

    if (req.file) {
      const filePath = req.file.path

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(parse({ columns: true, delimiter: ',' }))
          .on('data', function (row: UserTravelHistory) {
            data.push(row)
          })
          .on('end', function () {
            fs.promises.unlink(filePath)
            resolve()
          })
          .on('error', function (error) {
            reject(error)
          })
      })

      try {
        const totalFare = await this.travelService.calculateTotalFareFromHistory(data)

        return {
          code: 200,
          body: {
            totalFare,
          },
        }
      } catch (e) {
        errMsg = (e as Error).message
      }
    }

    return {
      code: 400,
      body: {
        error: errMsg ? errMsg : 'No file attached',
      },
    }
  }
}
