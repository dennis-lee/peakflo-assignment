import { Entity, PrimaryColumn } from 'typeorm'

@Entity('lines')
export class Line {
  @PrimaryColumn()
  name!: string
}
