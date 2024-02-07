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
import { UserTravelHistory } from './controller'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(weekOfYear)
dayjs.extend(utc)
dayjs.extend(isSameOrAfter)

export interface ICalculatedFare {
  fare: number
  dailyCap: number
  weeklyCap: number
}

export interface ITravelService {
  calculateFareBetweenTwoLines(origin: string, destination: string, date: Date): Promise<ICalculatedFare>
  calculateTotalFareFromHistory(data: UserTravelHistory[]): Promise<number>
}

export class TravelService implements ITravelService {
  constructor(
    private readonly lineRepository: ILineRepository,
    private readonly lineFareRepository: ILineFareRepository
  ) {}

  async calculateFareBetweenTwoLines(origin: string, destination: string, date: Date): Promise<ICalculatedFare> {
    try {
      const originLine = await this.lineRepository.findByName(origin)
      const destinationLine = await this.lineRepository.findByName(destination)
      const lineFare = await this.lineFareRepository.findByOriginAndDestinationLines(originLine, destinationLine)

      return {
        fare: this.isPeakFare(date) ? lineFare.peak_fare : lineFare.fare,
        dailyCap: lineFare.daily_cap,
        weeklyCap: lineFare.weekly_cap,
      }
    } catch (e) {
      throw e
    }
  }

  async calculateTotalFareFromHistory(data: UserTravelHistory[]): Promise<number> {
    try {
      const linesTravelled: {
        [id_trip: string]: {
          [id_trip_week: string]: {
            [id_week_day: string]: {
              total: number
            }
          }
        }
      } = {}

      for (const row of data) {
        let origin = row.FromLine
        let destination = row.ToLine

        let fare = await this.calculateFareBetweenTwoLines(origin, destination, dayjs.utc(row.DateTime).toDate())

        let journey = `${origin}-${destination}`
        let weekNumber = dayjs(row.DateTime).week()
        let dateString = new Date(row.DateTime).toLocaleDateString()

        const trip = linesTravelled[journey]
        if (trip) {
          // Recurring trip
          const tripWeek = trip[weekNumber]

          if (tripWeek) {
            // Trip on the same week
            const tripDay = tripWeek[dateString]
            let dailyCapReached = false
            let balance = 0

            if (tripDay) {
              // Trip on the same day
              let dayTotal = tripDay.total + fare.fare
              balance = fare.dailyCap - tripDay.total
              tripDay.total = dayTotal > fare.dailyCap ? fare.dailyCap : dayTotal
              dailyCapReached = dayTotal > fare.dailyCap
            } else {
              tripWeek[dateString] = {
                total: fare.fare,
              }
            }

            let weekTotal = tripWeek.weeklyTotal.total
            if (dailyCapReached) {
              weekTotal += balance
            } else {
              weekTotal += fare.fare
            }

            tripWeek.weeklyTotal.total = weekTotal > fare.weeklyCap ? fare.weeklyCap : weekTotal
          } else {
            trip[weekNumber] = {
              [dateString]: {
                total: fare.fare,
              },

              weeklyTotal: {
                total: fare.fare,
              },
            }
          }
        } else {
          linesTravelled[journey] = {
            [weekNumber]: {
              [dateString]: {
                total: fare.fare,
              },

              weeklyTotal: {
                total: fare.fare,
              },
            },
          }
        }
      }

      let totalFare = 0

      const trips = Object.keys(linesTravelled)
      trips.forEach((line) => {
        const currentLine = linesTravelled[line]
        const weeks = Object.keys(currentLine)

        weeks.forEach((week) => {
          totalFare += currentLine[week].weeklyTotal.total
        })
      })

      return totalFare
    } catch (e) {
      throw e
    }
  }

  private isPeakFare(date: Date): boolean {
    const day = date.getDay()
    let currentDate = dayjs.utc(date)
    let morningStart = dayjs.utc(date).startOf('day')
    let morningEnd = dayjs.utc(date).startOf('day')
    let eveningStart = dayjs.utc(date).startOf('day')
    let eveningEnd = dayjs.utc(date).startOf('day')

    switch (day) {
      case 0:
        // Sunday
        eveningStart = eveningStart.hour(PEAK_HOUR_WEEKEND_EVENING_START)
        eveningEnd = eveningEnd.hour(PEAK_HOUR_WEEKEND_EVENING_END)

        return currentDate.isSameOrAfter(eveningStart) && currentDate.isBefore(eveningEnd)
      case 6:
        // Saturday
        morningStart = morningStart.hour(PEAK_HOUR_WEEKEND_MORNING_START)
        morningEnd = morningEnd.hour(PEAK_HOUR_WEEKEND_MORNING_END)
        eveningStart = eveningStart.hour(PEAK_HOUR_WEEKEND_EVENING_START)
        eveningEnd = eveningEnd.hour(PEAK_HOUR_WEEKEND_EVENING_END)

        return (
          (currentDate.isSameOrAfter(morningStart) && currentDate.isBefore(morningEnd)) ||
          (currentDate.isSameOrAfter(eveningStart) && currentDate.isBefore(eveningEnd))
        )
      default:
        // Weekday
        morningStart = morningStart.hour(PEAK_HOUR_WEEKDAY_MORNING_START)
        morningEnd = morningEnd.hour(PEAK_HOUR_WEEKDAY_MORNING_END)
        eveningStart = eveningStart.hour(PEAK_HOUR_WEEKDAY_EVENING_START)
        eveningStart = eveningStart.minute(30)
        eveningEnd = eveningEnd.hour(PEAK_HOUR_WEEKDAY_EVENING_END)

        return (
          (currentDate.isSameOrAfter(morningStart) && currentDate.isBefore(morningEnd)) ||
          (currentDate.isSameOrAfter(eveningStart) && currentDate.isBefore(eveningEnd))
        )
    }
  }
}
