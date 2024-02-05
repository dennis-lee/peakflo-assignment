import express from 'express'
import multer from 'multer'
import os from 'os'
import { TravelController } from '../../travel/controller'
import { Logger } from '../../tools/logger'

const v1Router = express.Router()
const upload = multer({ dest: os.tmpdir() })

const logger = Logger.create()

const travelController = new TravelController(logger)

v1Router.post(
  '/travel/calculate/upload',
  upload.single('file'),
  travelController.calculateFaresFromCsv.bind(travelController)
)

export default v1Router
