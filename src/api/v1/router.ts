import express, { Handler } from 'express'
import multer from 'multer'
import os from 'os'
import { ITravelController } from '../../travel/controller'

const upload = multer({ dest: os.tmpdir() })

export interface IControllerResult {
  code: number
  body: Record<string, any>
}

type HandlerFunction = (req: express.Request) => Promise<IControllerResult>

export class ExpressRouter {
  constructor(private readonly travelController: ITravelController) {}

  public create(): express.Router {
    const router = express.Router()

    router.post(
      '/travel/calculate/upload',
      upload.single('file'),
      this.toController(this.travelController.calculateFaresFromCsv.bind(this.travelController))
    )

    return router
  }

  private toController(handlerFunction: HandlerFunction): express.Handler {
    return async function handler(req: express.Request, res: express.Response): Promise<void> {
      try {
        const result = await handlerFunction(req)

        if (result.body) {
          res.status(result.code).json(result.body)
        } else {
          res.status(result.code).end()
        }
      } catch (e) {
        res.status(500).json().end()
      }
    }
  }
}
