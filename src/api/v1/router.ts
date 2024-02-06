import express from 'express'
import multer from 'multer'
import os from 'os'
import { ITravelController } from '../../travel/controller'

const upload = multer({ dest: os.tmpdir() })

export class ExpressRouter {
  constructor(private readonly travelController: ITravelController) {}

  public create(): express.Router {
    const router = express.Router()

    router.post(
      '/travel/calculate/upload',
      upload.single('file'),
      this.travelController.calculateFaresFromCsv.bind(this.travelController)
    )

    return router
  }
}
