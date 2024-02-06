import { DataSource, Repository } from 'typeorm'
import { Line } from './entities/Line'
import { LineFare } from './entities/LineFare'
import { BaseRepository } from './BaseRepository'

export interface ILineFareRepository {
  findByOriginAndDestinationLines(
    originLine: Line,
    destinationLine: Line
  ): Promise<LineFare>
}

export class LineFareRepository extends BaseRepository<LineFare> {
  constructor(dataSource: DataSource) {
    super(LineFare, dataSource)
  }

  public async findByOriginAndDestinationLines(
    originLine: Line,
    destinationLine: Line
  ): Promise<LineFare> {
    try {
      const lineFare = await this.repository.findOneByOrFail({
        origin: originLine,
        destination: destinationLine,
      })

      return lineFare
    } catch (e) {
      throw e
    }
  }
}
