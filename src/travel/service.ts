import { ILineRepository } from '../repositories/LineRepository'
import { ILineFareRepository } from '../repositories/LineFareRepository'
import {
  PEAK_HOUR_WEEKDAY_EVENING_END,
  PEAK_HOUR_WEEKDAY_EVENING_START,
  PEAK_HOUR_WEEKDAY_MORNING_END,
  PEAK_HOUR_WEEKDAY_MORNING_START,
  PEAK_HOUR_WEEKEND_EVENING_END,
  PEAK_HOUR_WEEKEND_EVENING_START,
  PEAK_HOUR_WEEKEND_MORNING_END,
  PEAK_HOUR_WEEKEND_MORNING_START,
} from '../constants'

export interface ICalculatedFare {
  fare: number
  dailyCap: number
  weeklyCap: number
}

export interface ITravelService {
  calculateFareBetweenTwoLines(
    origin: string,
    destination: string,
    date: Date
  ): Promise<ICalculatedFare>
}

export class TravelService implements ITravelService {
  constructor(
    private readonly lineRepository: ILineRepository,
    private readonly lineFareRepository: ILineFareRepository
  ) {}

  async calculateFareBetweenTwoLines(
    origin: string,
    destination: string,
    date: Date
  ): Promise<ICalculatedFare> {
    try {
      const originLine = await this.lineRepository.findByName(origin)
      const destinationLine = await this.lineRepository.findByName(destination)
      const lineFare =
        await this.lineFareRepository.findByOriginAndDestinationLines(
          originLine,
          destinationLine
        )

      console.log(originLine, destinationLine, lineFare, this.isPeakFare(date))

      return {
        fare: this.isPeakFare(date) ? lineFare.peak_fare : lineFare.fare,
        dailyCap: lineFare.daily_cap,
        weeklyCap: lineFare.weekly_cap,
      }
    } catch (e) {
      throw e
    }
  }

  private isPeakFare(date: Date): boolean {
    const day = date.getDay()
    let morningStart = new Date()
    let morningEnd = new Date()
    let eveningStart = new Date()
    let eveningEnd = new Date()

    switch (day) {
      case 0:
        // Sunday
        eveningStart.setHours(PEAK_HOUR_WEEKEND_EVENING_START, 0, 0, 0)
        eveningEnd.setHours(PEAK_HOUR_WEEKEND_EVENING_END, 0, 0, 0)

        return date >= eveningStart && date < eveningEnd
      case 6:
        // Saturday
        morningStart.setHours(PEAK_HOUR_WEEKEND_MORNING_START, 0, 0, 0)
        morningEnd.setHours(PEAK_HOUR_WEEKEND_MORNING_END, 0, 0, 0)
        eveningStart.setHours(PEAK_HOUR_WEEKEND_EVENING_START, 0, 0, 0)
        eveningEnd.setHours(PEAK_HOUR_WEEKEND_EVENING_END, 0, 0, 0)

        return (
          (date >= morningStart && date < morningEnd) ||
          (date >= eveningStart && date < eveningEnd)
        )
      default:
        // Weekday
        morningStart.setHours(PEAK_HOUR_WEEKDAY_MORNING_START, 0, 0, 0)
        morningEnd.setHours(PEAK_HOUR_WEEKDAY_MORNING_END, 0, 0, 0)
        eveningStart.setHours(PEAK_HOUR_WEEKDAY_EVENING_START, 30, 0, 0)
        eveningEnd.setHours(PEAK_HOUR_WEEKDAY_EVENING_END, 0, 0, 0)

        return (
          (date >= morningStart && date < morningEnd) ||
          (date >= eveningStart && date < eveningEnd)
        )
    }
  }
}
