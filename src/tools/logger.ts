import pino from 'pino'

export class Logger {
  private static logger: pino.Logger

  private constructor() {}

  public static create(): pino.Logger {
    if (!this.logger) {
      this.logger = pino({
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        },
      })
    }

    return this.logger
  }
}
