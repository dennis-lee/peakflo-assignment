import { DataSource } from 'typeorm'
import { LineFareRepository } from '../repositories/LineFareRepository'
import { LineRepository } from '../repositories/LineRepository'
import { TravelService } from './service'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import utc from 'dayjs/plugin/utc'
dayjs.extend(weekOfYear)
dayjs.extend(utc)

describe('TravelService', () => {
  const mockDb = new DataSource({
    type: 'postgres',
  })
  const MockLineRepository = LineRepository as jest.Mocked<typeof LineRepository>
  const MockLineFareRepository = LineFareRepository as jest.Mocked<typeof LineFareRepository>
  const mockLineRepo = new MockLineRepository(mockDb)
  const mockLineFareRepo = new MockLineFareRepository(mockDb)
  const service = new TravelService(mockLineRepo, mockLineFareRepo)

  const greenLine = {
    name: 'Green',
  }

  const redLine = {
    name: 'Red',
  }

  describe('calculateFareBetweenTwoLines', () => {
    it('should return normal fare', async () => {
      mockLineRepo.findByName = jest.fn().mockReturnValueOnce(greenLine).mockReturnValueOnce(redLine)
      mockLineFareRepo.findByOriginAndDestinationLines = jest.fn().mockReturnValueOnce({
        origin: greenLine,
        destination: redLine,
        peak_fare: 2,
        fare: 1,
        daily_cap: 3,
        weekly_cap: 4,
      })

      const dWeekdayNonPeakHour = dayjs.utc().startOf('day').hour(1)

      const result = await service.calculateFareBetweenTwoLines('Green', 'Red', dWeekdayNonPeakHour.toDate())
      expect(result.fare).toBe(1)
    })

    it('should return peak fare', async () => {
      mockLineRepo.findByName = jest.fn().mockReturnValueOnce(greenLine).mockReturnValueOnce(redLine)
      mockLineFareRepo.findByOriginAndDestinationLines = jest.fn().mockReturnValueOnce({
        origin: greenLine,
        destination: redLine,
        peak_fare: 2,
        fare: 1,
        daily_cap: 3,
        weekly_cap: 4,
      })

      const dWeekdayPeakHour = dayjs.utc().startOf('day').hour(8)

      const result = await service.calculateFareBetweenTwoLines('Green', 'Red', dWeekdayPeakHour.toDate())
      expect(result.fare).toBe(2)
    })
  })

  describe('calculateTotalFareFromHistory', () => {
    it('should calculate fares correctly', async () => {
      mockLineRepo.findByName = jest.fn().mockReturnValueOnce(greenLine).mockReturnValueOnce(redLine)
      mockLineFareRepo.findByOriginAndDestinationLines = jest
        .fn()
        .mockReturnValueOnce({
          origin: greenLine,
          destination: greenLine,
          peak_fare: 2,
          fare: 1,
          daily_cap: 8,
          weekly_cap: 55,
        })
        .mockReturnValueOnce({
          origin: greenLine,
          destination: redLine,
          peak_fare: 4,
          fare: 3,
          daily_cap: 15,
          weekly_cap: 90,
        })
        .mockReturnValueOnce({
          origin: redLine,
          destination: redLine,
          peak_fare: 3,
          fare: 2,
          daily_cap: 12,
          weekly_cap: 70,
        })

      const result = await service.calculateTotalFareFromHistory([
        {
          FromLine: 'Green',
          ToLine: 'Green',
          DateTime: '2021-03-24T07:58:30',
        },
        {
          FromLine: 'Green',
          ToLine: 'Red',
          DateTime: '2021-03-24T09:58:30',
        },
        {
          FromLine: 'Red',
          ToLine: 'Red',
          DateTime: '2021-03-25T11:58:30',
        },
      ])
      expect(result).toBe(7)
    })
  })
})
