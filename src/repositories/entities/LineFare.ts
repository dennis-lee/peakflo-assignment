import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm'
import { Line } from './Line'

@Entity('line_fares')
export class LineFare {
  @PrimaryColumn({ name: 'origin_line' })
  @ManyToOne(() => Line)
  @JoinColumn({ name: 'origin_line' })
  origin!: Line

  @PrimaryColumn({ name: 'destination_line' })
  @ManyToOne(() => Line)
  @JoinColumn({ name: 'destination_line' })
  destination!: Line

  @Column()
  peak_fare!: number

  @Column()
  fare!: number

  @Column()
  daily_cap!: number

  @Column()
  weekly_cap!: number
}
