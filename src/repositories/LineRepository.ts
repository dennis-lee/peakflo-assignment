import { DataSource } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Line } from './entities/Line'

export interface ILineRepository {
  findByName(name: string): Promise<Line>
}

export class LineRepository
  extends BaseRepository<Line>
  implements ILineRepository
{
  constructor(dataSource: DataSource) {
    super(Line, dataSource)
  }

  public async findByName(name: string): Promise<Line> {
    try {
      const line = await this.repository.findOneByOrFail({
        name,
      })

      return line
    } catch (e) {
      throw e
    }
  }
}
