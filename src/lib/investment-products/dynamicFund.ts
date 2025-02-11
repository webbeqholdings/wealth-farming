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
  getDaysInMonth,
  lastDayOfMonth,
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

interface TradingDay {
  month: string
  days: number
  rate: number
  valid: boolean
  gender: string
}

interface YearData {
  year: {
    year: number
    tradingDaysLayer: TradingDay[]
  }
  date: string
  balance: number
  profit: number
  interestEarned: number
  rate: number
  termType: string
  days: number
}

interface ProfitData {
  [year: string]: YearData[]
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
        note = JSON.stringify({
          key: 'partialMonthNote',
          params: {
            days: monthItem.days,
            months: findMarketTradingDays(monthItem.month, yearData.year),
            gender: monthItem.gender,
          },
        })
        // note = `(${monthItem.days} / ${findMarketTradingDays(monthItem.month, yearData.year)} days) ${monthItem.gender}`
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
  const adjustedStartDate = isStartOfMonth(startDate) ? startDate : new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

  let endDate: Date;

  if (term === 'monthly') {
    endDate = new Date(adjustedStartDate.getFullYear(), adjustedStartDate.getMonth() + 1, 0); 
  }

  if (term === 'semester') {
    endDate = new Date(adjustedStartDate.getFullYear(), adjustedStartDate.getMonth() + 6, 0); 
  }

  if (term === 'quarterly') {
    endDate = new Date(adjustedStartDate.getFullYear(), adjustedStartDate.getMonth() + 3, 0); 
  }

  if (term === 'annually') { 
    endDate = new Date(adjustedStartDate.getFullYear() + 1, adjustedStartDate.getMonth(), 0);
  }

  return endDate;
}

export const contractMultiPeriodEndAt = (startDate: Date, term: Term, periods: number): Date => {
  const endByTerm = contractEndAt(startDate, term);
  let periodsEndAt: Date;
  
  if (periods <= 1) {
    return endByTerm;
  }
  const listOfMonths = getMonthsBetweenYears(startDate, addMonths(startDate, 50));
  
  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift(); 
  }

  const firstMonth = listOfMonths[0].months[0];
  
  const monthNumber = typeof firstMonth === 'string' ? parseInt(firstMonth, 10) : firstMonth;
  const yearNumber = listOfMonths[0].year; 

  const startDateFullMonth = new Date(yearNumber, monthNumber - 1, 1); 

  if (term === 'monthly') {
    periodsEndAt = addMonths(startDateFullMonth, periods);
  }

  if (term === 'annually') {
    periodsEndAt = addMonths(startDateFullMonth, periods * 12);
  }

  if (term === 'semester') {
    periodsEndAt = addMonths(startDateFullMonth, periods * 6);
  }

  if (term === 'quarterly') {
    periodsEndAt = addMonths(startDateFullMonth, periods * 3);
  }

  const endDate = new Date(periodsEndAt.getFullYear(), periodsEndAt.getMonth(), 0);

  return endDate;
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

export const getlastBalance = async (data: ProfitData): Promise<number> => {
  const years = Object.keys(data)
  const lastYear = years[years.length - 1]
  const lastEntry = data[lastYear][data[lastYear].length - 1]

  return lastEntry.balance
}
export const buildProfitLogsAnnualy = async (principal: number, startDate: Date, endDate: Date) => {
  const countDays: number = differenceInDays(endDate, startDate) + 1
  let isPartialContract = countDays < 90
  const products = await getPublicProducts()
  const defineAnnualy = 12
  const defineSemester = 6
  const defineQuarterly = 3

  let profitLogs: ProfitLogItem[] = []

  // Map List Months From (start to end)
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const flatMapMonths = listOfMonths.flatMap(
    (item) => item.months.map((month) => new Date(`${item.year}-${month}-01 00:00:00`)),
    // item.months.map((month) => month),
  )

  let _balance = principal

  let mapMonths: any = {
    Annually: [],
    Semester: [],
    Quarterly: [],
    Monthly: [],
  }

  // IF < 90 days

  let loopMonths = flatMapMonths

  while (true) {
    if (loopMonths.length >= defineAnnualy) {
      mapMonths.Annually = [...mapMonths.Annually, ...loopMonths.slice(0, defineAnnualy)]
      loopMonths = loopMonths.slice(defineAnnualy, loopMonths.length)
      continue
    }

    if (loopMonths.length >= defineSemester) {
      mapMonths.Semester = [...mapMonths.Semester, ...loopMonths.slice(0, defineSemester)]
      loopMonths = loopMonths.slice(defineSemester, loopMonths.length)
      continue
    }

    if (loopMonths.length >= defineQuarterly) {
      mapMonths.Quarterly = [...mapMonths.Quarterly, ...loopMonths.slice(0, defineQuarterly)]
      loopMonths = loopMonths.slice(defineQuarterly, loopMonths.length)
      continue
    }
    mapMonths.Monthly = loopMonths
    break
  }
  let _dayCount = 0
  let _bestTerm = null
  let _bestTermRate = null
  for (const key of ['Annually', 'Semester', 'Quarterly', 'Monthly']) {
    if (mapMonths[key].length == 0) continue

    let prod = products.find((prod: any) => {
      return prod.term == key.toLowerCase()
    })

    let rate = (prod as { rate_of_return: number }).rate_of_return

    if (_bestTerm == null) {
      _bestTerm = key
      _bestTermRate = rate
    }

    for (const mm of mapMonths[key]) {
      let _profit = _balance * rate
      _balance = _balance + _profit
      _dayCount += getDaysInMonth(mm)
      profitLogs.push({
        fromDate: mm,
        toDate: addDays(mm, getDaysInMonth(mm)),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: _dayCount,
        term: key,
        message: key,
      })
    }
  }

  if (!isStartOfMonth(startDate)) {
    let __days = differenceInDays(lastDayOfMonth(startDate), startDate) + 1
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(startDate)
    _balance = _balance + _profit
    profitLogs.unshift({
      fromDate: startDate,
      toDate: lastDayOfMonth(startDate),
      rate: _bestTermRate,
      balance: principal + _profit,
      profit: _profit,
      days: __days,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
    })
  }

  if (!isEndOfMonth(endDate)) {
    let __days = differenceInDays(endDate, new Date(getYear(endDate), getMonth(endDate), 1))
    _dayCount += __days
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(endDate)
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: new Date(getYear(endDate), getMonth(endDate), 1),
      toDate: endDate,
      rate: _bestTermRate,
      balance: _balance,
      profit: _profit,
      days: _dayCount,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
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
  const countDays: number = differenceInDays(endDate, startDate) + 1
  let isPartialContract = countDays < 90
  const products = await getPublicProducts()

  const defineSemester = 6
  const defineQuarterly = 3

  let profitLogs: ProfitLogItem[] = []

  // Map List Months From (start to end)
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const flatMapMonths = listOfMonths.flatMap(
    (item) => item.months.map((month) => new Date(`${item.year}-${month}-01 00:00:00`)),
    // item.months.map((month) => month),
  )

  let _balance = principal

  let mapMonths: any = {
    Annually: [],
    Semester: [],
    Quarterly: [],
    Monthly: [],
  }

  // IF < 90 days

  let loopMonths = flatMapMonths

  while (true) {
    if (loopMonths.length >= defineSemester) {
      mapMonths.Semester = [...mapMonths.Semester, ...loopMonths.slice(0, defineSemester)]
      loopMonths = loopMonths.slice(defineSemester, loopMonths.length)
      continue
    }

    if (loopMonths.length >= defineQuarterly) {
      mapMonths.Quarterly = [...mapMonths.Quarterly, ...loopMonths.slice(0, defineQuarterly)]
      loopMonths = loopMonths.slice(defineQuarterly, loopMonths.length)
      continue
    }
    mapMonths.Monthly = loopMonths
    break
  }
  let _dayCount = 0
  let _bestTerm = null
  let _bestTermRate = null
  for (const key of ['Annually', 'Semester', 'Quarterly', 'Monthly']) {
    if (mapMonths[key].length == 0) continue

    let prod = products.find((prod: any) => {
      return prod.term == key.toLowerCase()
    })
    let rate = (prod as { rate_of_return: number }).rate_of_return

    if (_bestTerm == null) {
      _bestTerm = key
      _bestTermRate = rate
    }

    for (const mm of mapMonths[key]) {
      let _profit = _balance * rate
      _balance = _balance + _profit
      _dayCount += getDaysInMonth(mm)
      profitLogs.push({
        fromDate: mm,
        toDate: addDays(mm, getDaysInMonth(mm)),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: _dayCount,
        term: key,
        message: key,
      })
    }
  }

  if (!isStartOfMonth(startDate)) {
    let __days = differenceInDays(lastDayOfMonth(startDate), startDate) + 1
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(startDate)
    _balance = _balance + _profit
    profitLogs.unshift({
      fromDate: startDate,
      toDate: lastDayOfMonth(startDate),
      rate: _bestTermRate,
      balance: principal + _profit,
      profit: _profit,
      days: __days,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
    })
  }

  if (!isEndOfMonth(endDate)) {
    let __days = differenceInDays(endDate, new Date(getYear(endDate), getMonth(endDate), 1))
    _dayCount += __days
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(endDate)
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: new Date(getYear(endDate), getMonth(endDate), 1),
      toDate: endDate,
      rate: _bestTermRate,
      balance: _balance,
      profit: _profit,
      days: _dayCount,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
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
  const countDays: number = differenceInDays(endDate, startDate) + 1
  let isPartialContract = countDays < 90
  const products = await getPublicProducts()
  const defineQuarterly = 3

  let profitLogs: ProfitLogItem[] = []

  // Map List Months From (start to end)
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const flatMapMonths = listOfMonths.flatMap(
    (item) => item.months.map((month) => new Date(`${item.year}-${month}-01 00:00:00`)),
    // item.months.map((month) => month),
  )

  let _balance = principal

  let mapMonths: any = {
    Annually: [],
    Semester: [],
    Quarterly: [],
    Monthly: [],
  }

  let loopMonths = flatMapMonths
  while (true) {
    if (loopMonths.length >= defineQuarterly) {
      mapMonths.Quarterly = [...mapMonths.Quarterly, ...loopMonths.slice(0, defineQuarterly)]
      loopMonths = loopMonths.slice(defineQuarterly, loopMonths.length)
      continue
    }
    mapMonths.Monthly = loopMonths
    break
  }
  let _dayCount = 0
  let _bestTerm = null
  let _bestTermRate = null
  for (const key of ['Annually', 'Semester', 'Quarterly', 'Monthly']) {
    if (mapMonths[key].length == 0) continue

    let prod = products.find((prod: any) => {
      return prod.term == key.toLowerCase()
    })
    let rate = (prod as { rate_of_return: number }).rate_of_return

    if (_bestTerm == null) {
      _bestTerm = key
      _bestTermRate = rate
    }

    for (const mm of mapMonths[key]) {
      let _profit = _balance * rate
      _balance = _balance + _profit
      _dayCount += getDaysInMonth(mm)
      profitLogs.push({
        fromDate: mm,
        toDate: addDays(mm, getDaysInMonth(mm)),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: _dayCount,
        term: key,
        message: key,
      })
    }
  }

  if (!isStartOfMonth(startDate)) {
    let __days = differenceInDays(lastDayOfMonth(startDate), startDate) + 1
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(startDate)
    _balance = _balance + _profit
    profitLogs.unshift({
      fromDate: startDate,
      toDate: lastDayOfMonth(startDate),
      rate: _bestTermRate,
      balance: principal + _profit,
      profit: _profit,
      days: __days,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
    })
  }

  if (!isEndOfMonth(endDate)) {
    let __days = differenceInDays(endDate, new Date(getYear(endDate), getMonth(endDate), 1))
    _dayCount += __days
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(endDate)
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: new Date(getYear(endDate), getMonth(endDate), 1),
      toDate: endDate,
      rate: _bestTermRate,
      balance: _balance,
      profit: _profit,
      days: __days,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
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
  const countDays: number = differenceInDays(endDate, startDate) + 1
  let isPartialContract = countDays < 90
  const products = await getPublicProducts()
  const defineQuarterly = 3

  let profitLogs: ProfitLogItem[] = []

  // Map List Months From (start to end)
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const flatMapMonths = listOfMonths.flatMap(
    (item) => item.months.map((month) => new Date(`${item.year}-${month}-01 00:00:00`)),
    // item.months.map((month) => month),
  )

  let _balance = principal

  let mapMonths: any = {
    Annually: [],
    Semester: [],
    Quarterly: [],
    Monthly: [],
  }

  mapMonths.Monthly = flatMapMonths
  let _dayCount = 0
  let _bestTerm = null
  let _bestTermRate = null
  for (const key of ['Monthly']) {
    if (mapMonths[key].length == 0) continue

    let prod = products.find((prod: any) => {
      return prod.term == key.toLowerCase()
    })
    let rate = (prod as { rate_of_return: number }).rate_of_return

    if (_bestTerm == null) {
      _bestTerm = key
      _bestTermRate = rate
    }

    for (const mm of mapMonths[key]) {
      let _profit = _balance * rate
      _balance = _balance + _profit
      _dayCount += getDaysInMonth(mm)
      profitLogs.push({
        fromDate: mm,
        toDate: addDays(mm, getDaysInMonth(mm)),
        rate: rate,
        balance: _balance,
        profit: _profit,
        days: _dayCount,
        term: key,
        message: key,
      })
    }
  }

  if (!isStartOfMonth(startDate)) {
    let __days = differenceInDays(lastDayOfMonth(startDate), startDate) + 1
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(startDate)
    _balance = _balance + _profit
    profitLogs.unshift({
      fromDate: startDate,
      toDate: lastDayOfMonth(startDate),
      rate: _bestTermRate,
      balance: principal + _profit,
      profit: _profit,
      days: __days,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
    })
  }

  if (!isEndOfMonth(endDate)) {
    let __days = differenceInDays(endDate, new Date(getYear(endDate), getMonth(endDate), 1))
    _dayCount += __days
    let _profit = (principal * _bestTermRate * __days) / getDaysInMonth(endDate)
    _balance = _balance + _profit
    profitLogs.push({
      fromDate: new Date(getYear(endDate), getMonth(endDate), 1),
      toDate: endDate,
      rate: _bestTermRate,
      balance: _balance,
      profit: _profit,
      days: _dayCount,
      term: _bestTerm,
      message: _bestTerm + ' Partial',
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
