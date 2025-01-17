// @ts-nocheckx

import {
  startOfYear,
  endOfMonth,
  addMonths,
  differenceInDays,
  isWithinInterval,
  getMonth,
  format,
  getYear,
  addYears,
  addDays,
} from 'date-fns'
import {
  getMonthsBetweenYears,
  findTermQuarterly,
  findTermSemester,
  findTermAnnualy,
  findTermMonthly,
  findMarketTradingDays,
  getTradingDaysStartOrEnd,
  isSubArrayContained,
  isStartOfMonth,
  isEndOfMonth,
} from '@/utilities/formatDateTime'

import { getTotalBonusByProduct, getTransactionsBonusByProduct } from '../transaction'
import { getPublicProducts } from './dynamicFundQuery'

export type Term =
  | 'partialMonth'
  | 'monthly'
  | 'quarterly'
  | 'semester'
  | 'annually'
  | 'BeforeStandard'
export const standardApplyProgramDays = 90
interface Rate {
  term: Term
  rate: number
  text: string
  isShowForm: Boolean
}

interface ProfitLogItem {
  fromDate: Date
  toDate: Date
  rate: number
  balance: number
  profit: number
  days: number
  term: string
  message: string
}

export const rateConfig: Rate[] = [
  { term: 'partialMonth', rate: 0.04, text: 'Partial Month', isShowForm: false },
  { term: 'monthly', rate: 0.0595, text: 'Monthly', isShowForm: true },
  { term: 'quarterly', rate: 0.0615, text: 'Quarterly', isShowForm: true },
  { term: 'semester', rate: 0.0635, text: 'Semester', isShowForm: true },
  { term: 'annually', rate: 0.0655, text: 'Annually', isShowForm: true },
  {
    term: 'BeforeStandard',
    rate: 0.2 / 12,
    text: `Before Standard ${standardApplyProgramDays} days`,
    isShowForm: false,
  },
]

type TradingDaysObject = {
  year: number
  tradingDaysLayer: any[]
}

export function groupByYear(list: any) {
  return list.reduce((acc: any, item: any) => {
    const year = item.year.year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(item)
    return acc
  }, {})
}

export const buildProfitRecordsAnnualy = (
  principal: number,
  startDate: Date,
  endDate: Date,
  isGroupByYear = true,
) => {
  const tradingDaysStartOrEnd = getTradingDaysStartOrEnd(startDate, endDate)

  // Fetching
  const dataAnnualy = (findTermAnnualy(startDate, endDate) as { result: any }).result
  const dataSemester = (findTermSemester(startDate, endDate) as { result: any }).result
  const dataQuarterly = (findTermQuarterly(startDate, endDate) as { result: any }).result

  // Rates
  const rateMonthly = rateConfig.find((r) => r.term === 'monthly').rate

  // Final Result by Timeline
  let masterTimeline = dataAnnualy.filter((item: any) => {
    return item.isValid == true
  })

  let invalidYears = dataAnnualy
    .filter((x: any) => x.isValid === false)
    .map((item: any) => {
      return item.year
    })
  console.log('check invalidYears: ', invalidYears)

  const dataYearLoop = dataAnnualy.filter((y: any) => {
    return y.isValid == false
  })

  for (const [index, yearData] of dataYearLoop.entries()) {
    let obj: TradingDaysObject = { year: yearData.year, tradingDaysLayer: [] }
    let _goodPerfectMonths = []
    let _goodSemesterMonths = dataSemester.filter((item: any) => {
      return item.year == yearData.year
    })
    let _saveSemesterMonths: any[] = []

    _goodSemesterMonths.forEach((item: any) => {
      item.tradingDaysLayer.forEach((x: any) => {
        if (x.valid == true) {
          obj.tradingDaysLayer.push(x)
          _saveSemesterMonths.push(x.month)
        }
      })
    })

    let _goodQuarters = dataQuarterly.filter((item: any) => {
      return item.year == yearData.year
    })

    _goodQuarters.forEach((item: any) => {
      item.tradingDaysLayer.forEach((x: any) => {
        if (!_saveSemesterMonths.includes(x.month)) {
          if (!x.valid) x.rate = rateMonthly

          obj.tradingDaysLayer.push(x)
        }
        if (x.valid == false && !_saveSemesterMonths.includes(x.month))
          _goodPerfectMonths.push(x.month)
      })
    })

    // Handle StartDate 's Month
    if (index == 0 && !isStartOfMonth(startDate)) {
      obj.tradingDaysLayer.push({
        month: format(startDate, 'MM'),
        days: (tradingDaysStartOrEnd as { startDate: any }).startDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate, // () / days trong file market trading days
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Handle EndDate 's Month
    if (index == dataYearLoop.length - 1 && !isEndOfMonth(endDate)) {
      obj.tradingDaysLayer.push({
        month: format(endDate, 'MM'),
        days: (tradingDaysStartOrEnd as { endDate: any }).endDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,
        valid: false,
        gender: 'Partial Month',
      })
    }

    obj.tradingDaysLayer.sort((a, b) => a.month - b.month)
    masterTimeline.push(obj)
  }

  masterTimeline.sort((a: any, b: any) => a.year - b.year)
  const profitData: any[] = []

  let balance = principal

  masterTimeline.forEach((yearData: any) => {
    yearData.tradingDaysLayer.forEach((monthItem: any) => {
      let periodInterest = balance * monthItem.rate
      let note = monthItem.gender
      let calRate = monthItem.rate
      if (monthItem.gender == 'Partial Month') {
        note = `(${monthItem.days} / ${findMarketTradingDays(monthItem.month, yearData.year)} days) ${monthItem.gender}`
        periodInterest =
          (balance * monthItem.rate * monthItem.days) /
          findMarketTradingDays(monthItem.month, yearData.year)

        calRate =
          (monthItem.rate / findMarketTradingDays(monthItem.month, yearData.year)) * monthItem.days
      }
      balance += periodInterest

      profitData.push({
        year: yearData,
        date: new Date(`${yearData.year}-${monthItem.month}-01`),
        balance: balance,
        profit: balance - principal,
        interestEarned: periodInterest,
        rate: calRate * 100,
        termType: note,
        days: monthItem.days,
      })
    })
  })

  if (!isGroupByYear) return profitData

  return groupByYear(profitData)
}

export const buildProfitRecordsSemester = (
  principal: number,
  startDate: Date,
  endDate: Date,
  isGroupByYear = true,
) => {
  const tradingDaysStartOrEnd = getTradingDaysStartOrEnd(startDate, endDate)

  // Fetching
  // const dataAnnualy = (findTermAnnualy(startDate, endDate) as { result: any }).result
  const dataSemester = (findTermSemester(startDate, endDate) as { result: any }).result
  const dataQuarterly = (findTermQuarterly(startDate, endDate) as { result: any }).result

  // Rates
  const rateMonthly = rateConfig.find((r) => r.term === 'monthly').rate

  // Final Result by Timeline
  let masterTimeline = []

  for (const [index, yearData] of dataSemester.entries()) {
    let obj: TradingDaysObject = { year: yearData.year, tradingDaysLayer: [] }
    let _saveSemesterMonths: any[] = []
    let _goodPerfectMonths = []
    // Core function filter
    yearData.tradingDaysLayer.forEach((item: any) => {
      if (item.valid == true) {
        obj.tradingDaysLayer.push(item)
        _saveSemesterMonths.push(item.month)
      }
    })

    // handle good Quarter
    let _goodQuarters = dataQuarterly.filter((item: any) => {
      return item.year == yearData.year
    })

    _goodQuarters.forEach((item: any) => {
      item.tradingDaysLayer.forEach((x: any) => {
        if (!_saveSemesterMonths.includes(x.month)) {
          if (!x.valid) x.rate = rateMonthly

          obj.tradingDaysLayer.push(x)
        }

        if (x.valid == false && !_saveSemesterMonths.includes(x.month))
          _goodPerfectMonths.push(x.month)
      })
    })

    // Handle StartDate 's Month
    if (index == 0 && !isStartOfMonth(startDate)) {
      obj.tradingDaysLayer.push({
        month: format(startDate, 'MM'),
        days: (tradingDaysStartOrEnd as { startDate: any }).startDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate, // () / days trong file market trading days
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Handle EndDate 's Month
    if (index == dataSemester.length - 1 && !isEndOfMonth(endDate)) {
      obj.tradingDaysLayer.push({
        month: format(endDate, 'MM'),
        days: (tradingDaysStartOrEnd as { endDate: any }).endDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Push to Timeline
    obj.tradingDaysLayer.sort((a, b) => a.month - b.month)
    masterTimeline.push(obj)
  }

  masterTimeline.sort((a: any, b: any) => a.year - b.year)
  const profitData: any[] = []

  let balance = principal

  masterTimeline.forEach((yearData: any) => {
    yearData.tradingDaysLayer.forEach((monthItem: any) => {
      let periodInterest = balance * monthItem.rate
      let note = monthItem.gender
      let calRate = monthItem.rate
      if (monthItem.gender == 'Partial Month') {
        note = `(${monthItem.days} / ${findMarketTradingDays(monthItem.month, yearData.year)} days) ${monthItem.gender}`
        periodInterest =
          (balance * monthItem.rate * monthItem.days) /
          findMarketTradingDays(monthItem.month, yearData.year)

        calRate =
          (monthItem.rate / findMarketTradingDays(monthItem.month, yearData.year)) * monthItem.days
      }
      balance += periodInterest

      profitData.push({
        year: yearData,
        date: new Date(`${yearData.year}-${monthItem.month}-01`),
        balance: balance,
        profit: balance - principal,
        interestEarned: periodInterest,
        rate: calRate * 100,
        termType: note,
        days: monthItem.days,
      })
    })
  })

  if (!isGroupByYear) return profitData

  return groupByYear(profitData)
}

export const buildProfitRecordsQuarterly = (
  principal: number,
  startDate: Date,
  endDate: Date,
  isGroupByYear = true,
) => {
  const tradingDaysStartOrEnd = getTradingDaysStartOrEnd(startDate, endDate)

  // Fetching
  // const dataAnnualy = (findTermAnnualy(startDate, endDate) as { result: any }).result
  // const dataSemester = (findTermSemester(startDate, endDate) as { result: any }).result
  const dataQuarterly = (findTermQuarterly(startDate, endDate) as { result: any }).result

  // Rates
  const rateMonthly = rateConfig.find((r) => r.term === 'monthly').rate

  // Final Result by Timeline
  let masterTimeline = []

  for (const [index, yearData] of dataQuarterly.entries()) {
    let obj: TradingDaysObject = { year: yearData.year, tradingDaysLayer: [] }
    // Core function filter
    yearData.tradingDaysLayer.forEach((item: any) => {
      if (!item.valid) {
        item.rate = rateMonthly
      }
      obj.tradingDaysLayer.push(item)
    })

    // Handle StartDate 's Month
    if (index == 0 && !isStartOfMonth(startDate)) {
      obj.tradingDaysLayer.push({
        month: format(startDate, 'MM'),
        days: (tradingDaysStartOrEnd as { startDate: any }).startDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate, // () / days trong file market trading days
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Handle EndDate 's Month
    if (index == dataQuarterly.length - 1 && !isEndOfMonth(endDate)) {
      obj.tradingDaysLayer.push({
        month: format(endDate, 'MM'),
        days: (tradingDaysStartOrEnd as { endDate: any }).endDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Push to Timeline
    obj.tradingDaysLayer.sort((a, b) => a.month - b.month)
    masterTimeline.push(obj)
  }

  masterTimeline.sort((a: any, b: any) => a.year - b.year)
  const profitData: any[] = []

  let balance = principal

  masterTimeline.forEach((yearData: any) => {
    yearData.tradingDaysLayer.forEach((monthItem: any) => {
      let periodInterest = balance * monthItem.rate
      let note = monthItem.gender
      let calRate = monthItem.rate
      if (monthItem.gender == 'Partial Month') {
        note = `(${monthItem.days} / ${findMarketTradingDays(monthItem.month, yearData.year)} days) ${monthItem.gender}`
        periodInterest =
          (balance * monthItem.rate * monthItem.days) /
          findMarketTradingDays(monthItem.month, yearData.year)

        calRate =
          (monthItem.rate / findMarketTradingDays(monthItem.month, yearData.year)) * monthItem.days
      }
      balance += periodInterest

      profitData.push({
        year: yearData,
        date: new Date(`${yearData.year}-${monthItem.month}-01`),
        balance: balance,
        profit: balance - principal,
        interestEarned: periodInterest,
        rate: calRate * 100,
        termType: note,
        days: monthItem.days,
      })
    })
  })

  if (!isGroupByYear) return profitData

  return groupByYear(profitData)
}

export const buildProfitRecordsMonthly = (
  principal: number,
  startDate: Date,
  endDate: Date,
  isGroupByYear = true,
) => {
  const tradingDaysStartOrEnd = getTradingDaysStartOrEnd(startDate, endDate)

  // Fetching
  // const dataAnnualy = (findTermAnnualy(startDate, endDate) as { result: any }).result
  // const dataSemester = (findTermSemester(startDate, endDate) as { result: any }).result
  const dataMonthly = (findTermMonthly(startDate, endDate) as { result: any }).result

  // Rates
  const rateMonthly = rateConfig.find((r) => r.term === 'monthly').rate

  // Final Result by Timeline
  let masterTimeline = []

  for (const [index, yearData] of dataMonthly.entries()) {
    let obj: TradingDaysObject = { year: yearData.year, tradingDaysLayer: [] }
    // Core function filter
    yearData.tradingDaysLayer.forEach((item: any) => {
      if (!item.valid) {
        item.rate = rateMonthly
      }
      obj.tradingDaysLayer.push(item)
    })

    // Handle StartDate 's Month
    if (index == 0 && !isStartOfMonth(startDate)) {
      obj.tradingDaysLayer.push({
        month: format(startDate, 'MM'),
        days: (tradingDaysStartOrEnd as { startDate: any }).startDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate, // () / days trong file market trading days
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Handle EndDate 's Month
    if (index == dataMonthly.length - 1 && !isEndOfMonth(endDate)) {
      obj.tradingDaysLayer.push({
        month: format(endDate, 'MM'),
        days: (tradingDaysStartOrEnd as { endDate: any }).endDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,
        valid: false,
        gender: 'Partial Month',
      })
    }

    // Push to Timeline
    obj.tradingDaysLayer.sort((a, b) => a.month - b.month)
    masterTimeline.push(obj)
  }

  masterTimeline.sort((a: any, b: any) => a.year - b.year)
  const profitData: any[] = []

  let balance = principal

  masterTimeline.forEach((yearData: any) => {
    yearData.tradingDaysLayer.forEach((monthItem: any) => {
      let periodInterest = balance * monthItem.rate
      let note = monthItem.gender
      let calRate = monthItem.rate
      if (monthItem.gender == 'Partial Month') {
        note = `(${monthItem.days} / ${findMarketTradingDays(monthItem.month, yearData.year)} days) ${monthItem.gender}`
        periodInterest =
          (balance * monthItem.rate * monthItem.days) /
          findMarketTradingDays(monthItem.month, yearData.year)

        calRate =
          (monthItem.rate / findMarketTradingDays(monthItem.month, yearData.year)) * monthItem.days
      }
      balance += periodInterest

      profitData.push({
        year: yearData,
        date: new Date(`${yearData.year}-${monthItem.month}-01`),
        balance: balance,
        profit: balance - principal,
        interestEarned: periodInterest,
        rate: calRate * 100,
        termType: note,
        days: monthItem.days,
      })
    })
  })

  if (!isGroupByYear) return profitData

  return groupByYear(profitData)
}

export const contractEndAt = (startDate: Date, term: Term): Date => {
  let endDate
  if (term == 'monthly') {
    if (isStartOfMonth(startDate)) {
      endDate = endOfMonth(startDate)
    }

    if (!isStartOfMonth(startDate)) {
      let nextMonth = addMonths(startDate, 1)
      let year = getYear(nextMonth)
      let month = format(nextMonth, 'MM')
      let endMonthdd = format(endOfMonth(nextMonth), 'dd')
      endDate = new Date(`${year}-${month}-${endMonthdd}`)
    }
  }

  if (term == 'semester') {
    const defineSemester = [
      ['01', '02', '03', '04', '05', '06'],
      ['07', '08', '09', '10', '11', '12'],
    ]

    const defineStartSemester = ['01', '07']
    const month = format(startDate, 'MM')

    if (isStartOfMonth(startDate)) {
      // Start Semester
      if (defineStartSemester.includes(month)) {
        let endMonth = defineSemester.filter((item) => {
          return item.includes(month)
        })[0][5]

        let year = getYear(startDate)
        let endMonthdd = format(endOfMonth(new Date(`${year}-${endMonth}-01`)), 'dd')
        endDate = new Date(`${year}-${endMonth}-${endMonthdd}`)
      }

      // not Start Semester

      if (!defineStartSemester.includes(month)) {
        if (['01', '02', '03', '04', '05', '06'].includes(month)) {
          let year = getYear(startDate)
          endDate = new Date(`${year}-12-31`)
        }

        if (['07', '08', '09', '10', '11', '12'].includes(month)) {
          let year = getYear(startDate) + 1
          endDate = new Date(`${year}-06-30`)
        }
      }
    }

    if (!isStartOfMonth(startDate)) {
      if (['01', '02', '03', '04', '05', '06'].includes(month)) {
        let year = getYear(startDate)
        endDate = new Date(`${year}-12-31`)
      }

      if (['07', '08', '09', '10', '11', '12'].includes(month)) {
        let year = getYear(startDate) + 1
        endDate = new Date(`${year}-06-30`)
      }
    }
  }

  if (term == 'quarterly') {
    const defineQuarterly = [
      ['01', '02', '03'],
      ['04', '05', '06'],
      ['07', '08', '09'],
      ['10', '11', '12'],
    ]

    const defineStartQuarterly = ['01', '04', '07', '10']
    const month = format(startDate, 'MM')

    if (isStartOfMonth(startDate)) {
      // Start Quarterly
      if (defineStartQuarterly.includes(month)) {
        let endMonth = defineQuarterly.filter((item) => {
          return item.includes(month)
        })[0][2]

        let year = getYear(startDate)
        let endMonthdd = format(endOfMonth(new Date(`${year}-${endMonth}-01`)), 'dd')
        endDate = new Date(`${year}-${endMonth}-${endMonthdd}`)
      }

      // not Start Quarterly
      if (!defineStartQuarterly.includes(month)) {
        let nextQuarterLastMonth
        let year = getYear(startDate)

        for (let index = 0; index < 3; index++) {
          let qq = defineQuarterly[index]

          if (qq.includes(month)) {
            if (index < 3) {
              nextQuarterLastMonth = defineQuarterly[index + 1][2]
              break
            }

            if (index == 3) {
              nextQuarterLastMonth = defineQuarterly[0][2]
              year = year + 1
              break
            }
          }
        }

        let endMonthdd = format(endOfMonth(new Date(`${year}-${nextQuarterLastMonth}-01`)), 'dd')
        endDate = new Date(`${year}-${nextQuarterLastMonth}-${endMonthdd}`)
      }
    }

    if (!isStartOfMonth(startDate)) {
      // not Start Quarterly
      if (defineStartQuarterly.includes(month)) {
        let nextQuarterLastMonth
        let year = getYear(startDate)

        for (let index = 0; index <= 3; index++) {
          let qq = defineQuarterly[index]

          if (qq.includes(month)) {
            if (index < 3) {
              nextQuarterLastMonth = defineQuarterly[index + 1][2]
              break
            }

            if (index == 3) {
              nextQuarterLastMonth = defineQuarterly[0][2]
              year = year + 1
              break
            }
          }
        }

        let endMonthdd = format(endOfMonth(new Date(`${year}-${nextQuarterLastMonth}-01`)), 'dd')
        endDate = new Date(`${year}-${nextQuarterLastMonth}-${endMonthdd}`)
      }
    }
  }

  if (term == 'annually') {
    const dd = format(startDate, 'dd')

    console.log('dd', dd)
    const MM = format(startDate, 'MM')
    const year = getYear(startDate)
    const isStartYear = MM == '01' && dd == '01'

    if (isStartYear) {
      endDate = new Date(`${year}-12-31`)
    }

    if (!isStartYear) {
      endDate = new Date(`${year + 1}-12-31`)
    }
  }

  return endDate
}

export const contractMultiPeriodEndAt = (startDate: Date, term: Term, periods: number): Date => {
  const endByTerm = contractEndAt(startDate, term)
  let periodsEndAt: Date
  if (periods <= 1) {
    return endByTerm
  }

  const _periods = periods - 1

  if (term == 'monthly') {
    periodsEndAt = addMonths(endByTerm, _periods)
  }

  if (term == 'annually') {
    periodsEndAt = addMonths(endByTerm, _periods * 12)
  }

  if (term == 'semester') {
    periodsEndAt = addMonths(endByTerm, _periods * 6)
  }

  if (term == 'quarterly') {
    periodsEndAt = addMonths(endByTerm, _periods * 4)
  }

  return periodsEndAt
}

export const isValidForStandardApplyCancelContract = (startDate: Date): Boolean => {
  let today = new Date()

  return differenceInDays(today, startDate) > standardApplyProgramDays
}

export const canCancelContractAt = (startDate: Date): Date => {
  return addDays(startDate, standardApplyProgramDays)
}

export const calculatePenaltyContractRecords = async (
  product_id: number,
  user_id: number,
  root_amount: number,
) => {
  // get all transaction bonus --> sum = X , count = N
  // (N x 1.67) - X + root = result ; return result[]
  // t{} --> amount = sum(bonus[])
  // t{} --> amount = sum(penalty[])
  // t{} --> amount = Root - sum(bonus[]) + sum(penalty[])

  const total_bonus = await getTotalBonusByProduct(product_id, user_id)
  const months = (await getTransactionsBonusByProduct(product_id, user_id)).length
  if (!months) return false

  return root_amount - total_bonus + 0.0167 * 12
}

export const buildProfitLogsAnnualy = async (principal: number, startDate: Date, endDate: Date) => {
  const countDays: number = differenceInDays(endDate, startDate)
  const unitMonthly: number = 30

  const products = await getPublicProducts()

  let prod = products.find((prod: any) => {
    return prod.term == 'annually'
  })

  let rate = (prod as { rate_of_return: number }).rate_of_return

  let profitLogs: ProfitLogItem[] = []

  let periods = Math.trunc(countDays / (unitMonthly * 12))
  let periodsModDays = countDays % (unitMonthly * 12)

  let _fromDate = startDate
  let _balance = principal
  let isPartialContract = false

  if (periods == 0) {
    isPartialContract = true
  }

  if (periods > 0) {
    for (let mm = 1; mm <= 12 * periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'annually',
        message: 'full annually',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays == 0) {
    return {
      balance: _balance,
      profit: _balance - principal,
      roi: (_balance - principal) / principal,
      profitLogs: profitLogs,
      terminate: isPartialContract
        ? terminatePartialContract(principal, _balance - principal, countDays)
        : _balance,
    }
  }

  // SEMESTER ...
  if (periodsModDays >= unitMonthly * 6) {
    prod = products.find((prod: any) => {
      return prod.term == 'semester'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    periods = Math.trunc(periodsModDays / (unitMonthly * 6))
    periodsModDays = periodsModDays % (unitMonthly * 6) // Update periodsModDays
    // ROI = Compound Rate + ModDays Rate
    for (let mm = 1; mm <= 6 * periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'semester',
        message: 'full semester',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays == 0) {
    return {
      balance: _balance,
      profit: _balance - principal,
      roi: (_balance - principal) / principal,
      profitLogs: profitLogs,
      isPartialContract: isPartialContract,
      terminate: isPartialContract
        ? terminatePartialContract(_balance, _balance - principal, countDays)
        : _balance,
    }
  }

  // Quarterly ...
  if (periodsModDays >= unitMonthly * 3) {
    prod = products.find((prod: any) => {
      return prod.term == 'quarterly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    periods = Math.trunc(periodsModDays / (unitMonthly * 3))
    periodsModDays = periodsModDays % (unitMonthly * 3) // Update periodsModDays

    for (let mm = 1; mm <= 3 * periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'quarterly',
        message: 'full quarterly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays >= unitMonthly) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    periods = Math.trunc(periodsModDays / unitMonthly)
    periodsModDays = periodsModDays % unitMonthly // Update periodsModDays
    // ROI = Compound Rate + ModDays Rate

    for (let mm = 1; mm <= periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'monthly',
        message: 'full monthly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays > 0) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    let _profit = (_balance * rate * periodsModDays) / unitMonthly
    _balance = _balance + _profit

    profitLogs.push({
      fromDate: _fromDate,
      toDate: endDate,
      rate: rate,
      balance: _balance,
      profit: _profit,
      days: periodsModDays,
      term: 'monthly',
      message: 'partial monthly',
    })
  }

  return {
    balance: _balance,
    profit: _balance - principal,
    roi: (_balance - principal) / principal,
    profitLogs: profitLogs,
    isPartialContract: isPartialContract,
    terminate: isPartialContract
      ? terminatePartialContract(_balance, _balance - principal, countDays)
      : _balance,
  }
}

export const buildProfitLogsSemester = async (
  principal: number,
  startDate: Date,
  endDate: Date,
) => {
  const countDays: number = differenceInDays(endDate, startDate)
  const unitMonthly: number = 30

  const products = await getPublicProducts()

  let prod = products.find((prod: any) => {
    return prod.term == 'semester'
  })

  let rate = (prod as { rate_of_return: number }).rate_of_return

  let profitLogs: ProfitLogItem[] = []

  let periods = Math.trunc(countDays / (unitMonthly * 6))
  let periodsModDays = countDays % (unitMonthly * 6)

  let isPartialContract = false

  if (periods == 0) {
    isPartialContract = true
  }

  let _fromDate = startDate
  let _balance = principal

  if (periods > 0) {
    for (let mm = 1; mm <= 6 * periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'semester',
        message: 'full semester',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays == 0) {
    return {
      balance: _balance,
      profit: _balance - principal,
      roi: (_balance - principal) / principal,
      profitLogs: profitLogs,
      isPartialContract: isPartialContract,
      terminate: isPartialContract
        ? terminatePartialContract(principal, _balance - principal, countDays)
        : _balance,
    }
  }

  // Quarterly ...
  if (periodsModDays >= unitMonthly * 3) {
    prod = products.find((prod: any) => {
      return prod.term == 'quarterly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    periods = Math.trunc(periodsModDays / (unitMonthly * 3))
    periodsModDays = periodsModDays % (unitMonthly * 3) // Update periodsModDays

    for (let mm = 1; mm <= 3 * periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'quarterly',
        message: 'full quarterly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays >= unitMonthly) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    periods = Math.trunc(periodsModDays / unitMonthly)
    periodsModDays = periodsModDays % unitMonthly // Update periodsModDays
    // ROI = Compound Rate + ModDays Rate

    for (let mm = 1; mm <= periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'monthly',
        message: 'full monthly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays > 0) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    let _profit = (_balance * rate * periodsModDays) / unitMonthly
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: _fromDate,
      toDate: endDate,
      rate: rate,
      balance: _balance,
      profit: _profit,
      days: periodsModDays,
      term: 'monthly',
      message: 'partial monthly',
    })
  }

  return {
    balance: _balance,
    profit: _balance - principal,
    roi: (_balance - principal) / principal,
    profitLogs: profitLogs,
    isPartialContract: isPartialContract,
    terminate: isPartialContract
      ? terminatePartialContract(_balance, _balance - principal, countDays)
      : _balance,
  }
}

export const buildProfitLogsQuarterly = async (
  principal: number,
  startDate: Date,
  endDate: Date,
) => {
  const countDays: number = differenceInDays(endDate, startDate)
  const unitMonthly: number = 30

  const products = await getPublicProducts()

  let prod = products.find((prod: any) => {
    return prod.term == 'quarterly'
  })

  let rate = (prod as { rate_of_return: number }).rate_of_return

  let profitLogs: ProfitLogItem[] = []

  let periods = Math.trunc(countDays / (unitMonthly * 3))
  let periodsModDays = countDays % (unitMonthly * 3)

  let isPartialContract = false

  if (periods == 0) {
    isPartialContract = true
  }

  let _fromDate = startDate
  let _balance = principal

  if (periods > 0) {
    for (let mm = 1; mm <= 3 * periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'quarterly',
        message: 'full quarterly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays == 0) {
    return {
      balance: _balance,
      profit: _balance - principal,
      roi: (_balance - principal) / principal,
      profitLogs: profitLogs,
      isPartialContract: isPartialContract,
      terminate: isPartialContract
        ? terminatePartialContract(_balance, _balance - principal, countDays)
        : _balance,
    }
  }

  if (periodsModDays >= unitMonthly) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    periods = Math.trunc(periodsModDays / unitMonthly)
    periodsModDays = periodsModDays % unitMonthly // Update periodsModDays
    // ROI = Compound Rate + ModDays Rate

    for (let mm = 1; mm <= periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'monthly',
        message: 'full monthly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays > 0) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    let _profit = (_balance * rate * periodsModDays) / unitMonthly
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: _fromDate,
      toDate: endDate,
      rate: rate,
      balance: _balance,
      profit: _profit,
      days: periodsModDays,
      term: 'monthly',
      message: 'partial monthly',
    })
  }

  return {
    balance: _balance,
    profit: _balance - principal,
    roi: (_balance - principal) / principal,
    profitLogs: profitLogs,
    isPartialContract: isPartialContract,
    terminate: isPartialContract
      ? terminatePartialContract(_balance, _balance - principal, countDays)
      : _balance,
  }
}

export const buildProfitLogsMonthly = async (principal: number, startDate: Date, endDate: Date) => {
  const countDays: number = differenceInDays(endDate, startDate)
  const unitMonthly: number = 30

  const products = await getPublicProducts()

  let prod = products.find((prod: any) => {
    return prod.term == 'monthly'
  })

  let rate = (prod as { rate_of_return: number }).rate_of_return

  let profitLogs: ProfitLogItem[] = []

  let periods = Math.trunc(countDays / unitMonthly)
  let periodsModDays = countDays % unitMonthly

  let isPartialContract = false

  if (periods == 0) {
    isPartialContract = true
  }

  let _fromDate = startDate
  let _balance = principal

  if (periods > 0) {
    for (let mm = 1; mm <= periods; mm++) {
      let _profit = _balance * rate
      _balance = _balance + _profit

      profitLogs.push({
        fromDate: _fromDate,
        toDate: addDays(_fromDate, unitMonthly),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: unitMonthly * mm,
        term: 'monthly',
        message: 'full monthly',
      })

      _fromDate = addDays(_fromDate, unitMonthly)
    }
  }

  if (periodsModDays == 0) {
    return {
      balance: _balance,
      profit: _balance - principal,
      roi: (_balance - principal) / principal,
      profitLogs: profitLogs,
      isPartialContract: isPartialContract,
      terminate: isPartialContract
        ? terminatePartialContract(_balance, _balance - principal, countDays)
        : _balance,
    }
  }

  if (periodsModDays > 0) {
    prod = products.find((prod: any) => {
      return prod.term == 'monthly'
    })

    rate = (prod as { rate_of_return: number }).rate_of_return

    let _profit = (_balance * rate * periodsModDays) / unitMonthly
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: _fromDate,
      toDate: endDate,
      rate: rate,
      balance: _balance,
      profit: _profit,
      days: periodsModDays,
      term: 'monthly',
      message: 'partial monthly',
    })
  }

  return {
    balance: _balance,
    profit: _balance - principal,
    roi: (_balance - principal) / principal,
    profitLogs: profitLogs,
    isPartialContract: isPartialContract,
    terminate: isPartialContract
      ? terminatePartialContract(_balance, _balance - principal, countDays)
      : _balance,
  }
}

const terminatePartialContract = (_balance: number, profit: number, days: number) => {
  return _balance - profit + (days * 0.0167) / 30
}
