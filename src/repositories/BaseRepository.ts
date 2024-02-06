import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'

export abstract class BaseRepository<T extends ObjectLiteral> {
  readonly repository: Repository<T>

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity)
  }
}
