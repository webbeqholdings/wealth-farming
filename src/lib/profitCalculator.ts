// @ts-nocheck

import {
  startOfYear,
  endOfMonth,
  addMonths,
  differenceInDays,
  isWithinInterval,
  getMonth,
  format,
} from 'date-fns'
import {
  getMonthsBetweenYears,
  findTermQuarterly,
  findTermSemester,
  findTermAnnualy,
  findMarketTradingDays,
  getTradingDaysStartOrEnd,
  isSubArrayContained,
  isStartOfMonth,
  isEndOfMonth,
} from '@/utilities/formatDateTime'
type Term = 'less than 1 month' | '1 month' | 'quarterly' | 'semester' | 'annually'

interface Rate {
  term: Term
  rate: number
}

const rates: Rate[] = [
  { term: 'less than 1 month', rate: 0.04 },
  { term: '1 month', rate: 0.0595 },
  { term: 'quarterly', rate: 0.0615 },
  { term: 'semester', rate: 0.0635 },
  { term: 'annually', rate: 0.0655 },
]
const rateConfig: Rate[] = [
  { term: 'partialMonth', rate: 0.04 },
  { term: 'Month', rate: 0.0595 },
  { term: 'Quarterly', rate: 0.0615 },
  { term: 'Semester', rate: 0.0635 },
  { term: 'Annually', rate: 0.0655 },
]

export const calculateProfit = (
  principal: number,
  startDate: Date,
  endDate: Date,
  selectedTerm: Term,
) => {
  let balance = principal
  const profitData = []
  let currentDate = new Date(startDate)
  const yearStart = startOfYear(startDate)

  // getList (x, y) Months

  while (currentDate <= endDate) {
    // Loop each month
    const monthEnd = endOfMonth(currentDate)
    const periodEnd = monthEnd < endDate ? monthEnd : endDate

    let rate: number
    let termType: string

    // Update

    const daysInPeriod = differenceInDays(periodEnd, currentDate) + 1
    const tradingDays = 22

    console.log('daysInPeriod', daysInPeriod)
    console.log('tradingDays', tradingDays)

    // Calculate interest for the period
    const periodInterest =
      balance * rate * (termType === 'less than 1 month' ? daysInPeriod / tradingDays : 1)
    balance += periodInterest

    profitData.push({
      date: new Date(currentDate),
      balance: balance,
      profit: balance - principal,
      interestEarned: periodInterest,
      rate: rate * 100,
      termType: termType,
    })

    currentDate = new Date(periodEnd)
    currentDate.setDate(currentDate.getDate() + 1) // Move to next day
  }

  return profitData
}

function groupByYear(list) {
  return list.reduce((acc, item) => {
    const year = item.year.year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(item)
    return acc
  }, {})
}

export const buildProfitRecordsAnnualy = (principal: number, startDate: Date, endDate: Date) => {
  const tradingDaysStartOrEnd = getTradingDaysStartOrEnd(startDate, endDate)
  const dataAnnualy = findTermAnnualy(startDate, endDate).result

  let masterTimeline = dataAnnualy.filter((item) => {
    return item.isValid == true
  })
  console.log('check masterTimeline: ', masterTimeline);

  let invalidYears = dataAnnualy
    .filter((x) => x.isValid === false)
    .map((item: any) => {
      return item.year
    })
    console.log('check invalidYears: ', invalidYears);

  const dataSemester = findTermSemester(startDate, endDate).result
  const dataQuarterly = findTermQuarterly(startDate, endDate).result
  const dataYearLoop = dataAnnualy.filter((y) => {
    return y.isValid == false
  })

  for (const [index, yearData] of dataYearLoop.entries()) {
    let obj = { year: yearData.year, tradingDaysLayer: [] }
    let _goodPerfectMonths = []
    let _goodSemesterMonths = dataSemester.filter((item) => {
      return item.year == yearData.year
    })
    let _saveSemesterMonths = []

    _goodSemesterMonths.forEach((item) => {
      item.tradingDaysLayer.forEach((x) => {
        if (x.valid == true) {
          obj.tradingDaysLayer.push(x)
          _saveSemesterMonths.push(x.month)
        }
      })
    })

    let _goodQuarters = dataQuarterly.filter((item) => {
      return item.year == yearData.year
    })

    _goodQuarters.forEach((item) => {
      item.tradingDaysLayer.forEach((x) => {
        if (!_saveSemesterMonths.includes(x.month)) {
          if (!x.valid) x.rate = 0.04

          obj.tradingDaysLayer.push(x)
        }
        if (x.valid == false && !_saveSemesterMonths.includes(x.month))
          _goodPerfectMonths.push(x.month)
      })
    })

    if (index == 0 && !isStartOfMonth(startDate)) {
      // Gắn tháng của StartDate
      obj.tradingDaysLayer.push({
        month: format(startDate, 'MM'),
        days: tradingDaysStartOrEnd.startDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,// () / days trong file market trading days
        valid: false,
        gender: 'Partial Month',
      })
    }
    if (index == dataYearLoop.length - 1 && !isEndOfMonth(endDate)) {
      obj.tradingDaysLayer.push({
        month: format(endDate, 'MM'),
        days: tradingDaysStartOrEnd.endDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,
        valid: false,
        gender: 'Partial Month',
      })
    }

    obj.tradingDaysLayer.sort((a, b) => a.month - b.month)
    masterTimeline.push(obj)
  }

  masterTimeline.sort((a, b) => a.year - b.year)
  const profitData = []

  let balance = principal

  masterTimeline.forEach((yearData) => {
    yearData.tradingDaysLayer.forEach((monthItem) => {
      let periodInterest = balance * monthItem.rate
      let note = monthItem.gender
      if(monthItem.gender == 'Partial Month'){
        note = `${findMarketTradingDays(monthItem.month, yearData.year)} ${monthItem.gender}`
        periodInterest = balance * monthItem.rate * monthItem.days / (findMarketTradingDays(monthItem.month, yearData.year))
      }
      balance += periodInterest

      profitData.push({
        year: yearData,
        date: new Date(`${yearData.year}-${monthItem.month}-01`),
        balance: balance,
        profit: balance - principal,
        interestEarned: periodInterest,
        rate: monthItem.rate * 100,
        termType: note,
        days: monthItem.days,
      })
    })
  })

  return groupByYear(profitData)
}

export const calculateTotalProfit = (principal: number, startDate: Date, endDate: Date) => {
  const tradingDaysStartOrEnd = getTradingDaysStartOrEnd(startDate, endDate)
  const dataAnnualy = findTermAnnualy(startDate, endDate).result

  let masterTimeline = dataAnnualy.filter((item) => {
    return item.isValid == true
  })

  let invalidYears = dataAnnualy
    .filter((x) => x.isValid === false)
    .map((item: any) => {
      return item.year
    })

  const dataSemester = findTermSemester(startDate, endDate).result
  const dataQuarterly = findTermQuarterly(startDate, endDate).result
  const dataYearLoop = dataAnnualy.filter((y) => {
    return y.isValid == false
  })

  for (const [index, yearData] of dataYearLoop.entries()) {
    let obj = { year: yearData.year, tradingDaysLayer: [] }
    let _goodPerfectMonths = []
    let _goodSemesterMonths = dataSemester.filter((item) => {
      return item.year == yearData.year
    })
    let _saveSemesterMonths = []

    _goodSemesterMonths.forEach((item) => {
      item.tradingDaysLayer.forEach((x) => {
        if (x.valid == true) {
          obj.tradingDaysLayer.push(x)
          _saveSemesterMonths.push(x.month)
        }
      })
    })

    let _goodQuarters = dataQuarterly.filter((item) => {
      return item.year == yearData.year
    })

    _goodQuarters.forEach((item) => {
      item.tradingDaysLayer.forEach((x) => {
        if (!_saveSemesterMonths.includes(x.month)) {
          if (!x.valid) x.rate = 0.04

          obj.tradingDaysLayer.push(x)
        }
        if (x.valid == false && !_saveSemesterMonths.includes(x.month))
          _goodPerfectMonths.push(x.month)
      })
    })

    if (index == 0 && !isStartOfMonth(startDate)) {
      // Gắn tháng của StartDate
      obj.tradingDaysLayer.push({
        month: format(startDate, 'MM'),
        days: tradingDaysStartOrEnd.startDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,// () / days trong file market trading days
        valid: false,
        gender: 'Partial Month',
      })
    }
    if (index == dataYearLoop.length - 1 && !isEndOfMonth(endDate)) {
      obj.tradingDaysLayer.push({
        month: format(endDate, 'MM'),
        days: tradingDaysStartOrEnd.endDate,
        rate: rateConfig.find((r) => r.term === 'partialMonth').rate,
        valid: false,
        gender: 'Partial Month',
      })
    }

    obj.tradingDaysLayer.sort((a, b) => a.month - b.month)
    masterTimeline.push(obj)
  }

  masterTimeline.sort((a, b) => a.year - b.year)
  const profitData = []

  let balance = principal

  masterTimeline.forEach((yearData) => {
    yearData.tradingDaysLayer.forEach((monthItem) => {
      let periodInterest = balance * monthItem.rate
      let note = monthItem.gender
      if(monthItem.gender == 'Partial Month'){
        note = `${findMarketTradingDays(monthItem.month, yearData.year)} ${monthItem.gender}`
        periodInterest = balance * monthItem.rate * monthItem.days / (findMarketTradingDays(monthItem.month, yearData.year))
      }
      balance += periodInterest

      profitData.push({
        year: yearData,
        date: new Date(`${yearData.year}-${monthItem.month}-01`),
        balance: balance,
        profit: balance - principal,
        interestEarned: periodInterest,
        rate: monthItem.rate * 100,
        termType: note,
        days: monthItem.days,
      })
    })
  })

  return balance;
}
