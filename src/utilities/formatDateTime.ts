import {
  getYear,
  isSameYear,
  format,
  eachMonthOfInterval,
  endOfMonth,
  getMonth,
  addMonths,
  startOfMonth,
} from 'date-fns'
interface YearMonths {
  year: number
  months: string[]
}

import dataMarketWorkingDays from '@/config/market-working-days.json'

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Ho_Chi_Minh', // Adjust as needed
  }).format(date)
}

export function getMonthsBetweenYears(startDate: Date, endDate: Date): YearMonths[] {
  // Ensure startDate is not after endDate
  if (startDate > endDate) {
    ;[startDate, endDate] = [endDate, startDate]
  }

  // Convert dates to start of month to ensure we capture full months
  const startOfFirstMonth = startOfMonth(startDate)
  const startOfLastMonth = startOfMonth(endDate)

  // Generate an array of all months between start and end
  const monthArray = eachMonthOfInterval({
    start: startOfFirstMonth,
    end: startOfLastMonth,
  })

  // Create a map to group months by year
  const yearMap = new Map<number, string[]>()

  monthArray.forEach((date) => {
    const year = getYear(date)
    const month = format(date, 'MM')

    if (!yearMap.has(year)) {
      yearMap.set(year, [])
    }
    yearMap.get(year)?.push(month)
  })

  // Convert map to array of YearMonths objects
  const result: YearMonths[] = Array.from(yearMap.entries()).map(([year, months]) => ({
    year,
    months: [...months], // Create a new array to avoid reference issues
  }))

  console.log('-- result', result)

  return result
}

export function isSubArrayContained(subArray: string[], mainArray: string[]): boolean {
  if (subArray.length === 0) {
    return true // An empty sub-array is always contained
  }

  if (subArray.length > mainArray.length) {
    return false // Sub-array can't be longer than the main array
  }

  for (let i = 0; i <= mainArray.length - subArray.length; i++) {
    let isMatch = true
    for (let j = 0; j < subArray.length; j++) {
      if (subArray[j] !== mainArray[i + j]) {
        isMatch = false
        break
      }
    }
    if (isMatch) {
      return true
    }
  }

  return false
}

export function isStartOfMonth(date: Date): boolean {
  return format(date, 'qq') == '01'
}
export function isEndOfMonth(date: Date): boolean {
  return format(date, 'dd') === format(endOfMonth(date), 'dd')
}

export function filterTermInvestment(startDate: Date, endDate: Date, term: string) {
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)

  let partial_months: Date[] = [] // 4% Start | End

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
    partial_months.push(startDate)
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
    partial_months.push(endDate)
  }
}

export function findTermQuarterly(startDate: Date, endDate: Date): boolean | object[] {
  const defineQuarterly = [
    ['01', '02', '03'],
    ['04', '05', '06'],
    ['07', '08', '09'],
    ['10', '11', '12'],
  ]
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const result = []

  for (let yearItem of listOfMonths) {
    if (yearItem.months.length < 3) {
      continue
    }
    let monthsMatcher = []
    let tradingDaysMatcher = []
    for (let arr of defineQuarterly) {
      if (isSubArrayContained(arr, yearItem.months)) {
        monthsMatcher.push(arr)
        for (let tradingMonth of arr) {
          tradingDaysMatcher.push({
            month: tradingMonth,
            days: findMarketTradingDays(tradingMonth, yearItem.year),
          })
        }
      }
    }

    if (monthsMatcher.length) {
      result.push({
        year: yearItem.year,
        monthsLayers: monthsMatcher,
        tradingDaysLayer: tradingDaysMatcher,
      })
    }
  }

  if (!result.length) return false

  return result
}

export function findTermSemester(startDate: Date, endDate: Date): boolean | object[] {
  const defineSemester = [
    ['01', '02', '03', '04', '05', '06'],
    ['07', '08', '09', '10', '11', '12'],
  ]
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const result = []

  for (let yearItem of listOfMonths) {
    if (yearItem.months.length < 6) {
      continue
    }
    let monthsMatcher = []
    let tradingDaysMatcher = []
    for (let arr of defineSemester) {
      if (isSubArrayContained(arr, yearItem.months)) {
        monthsMatcher.push(arr)
        for (let tradingMonth of arr) {
          tradingDaysMatcher.push({
            month: tradingMonth,
            days: findMarketTradingDays(tradingMonth, yearItem.year),
          })
        }
      }
    }

    if (monthsMatcher.length) {
      result.push({
        year: yearItem.year,
        monthsLayers: monthsMatcher,
        tradingDaysLayer: tradingDaysMatcher,
      })
    }
  }

  if (!result.length) return false

  return result
}

export function findTermAnnualy(startDate: Date, endDate: Date): boolean | object[] {
  const defineAnnualy = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const result = []

  for (let yearItem of listOfMonths) {
    if (yearItem.months.length < 12) {
      continue
    }
    let monthsMatcher = []
    let tradingDaysMatcher = []
    if (isSubArrayContained(defineAnnualy, yearItem.months)) {
      monthsMatcher.push(defineAnnualy)

      for (let tradingMonth of defineAnnualy) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
        })
      }
      result.push({
        year: yearItem.year,
        monthsLayers: monthsMatcher,
        tradingDaysLayer: tradingDaysMatcher,
      })
    }
  }

  if (!result.length) return false

  return result
}

export function findMarketTradingDays(_month: string, _year: string | number) {
  const data = dataMarketWorkingDays
  let monthName = format(new Date(`${_year}-${_month}-01`), 'LLL')

  // @ts-ignore
  return data[_year].months[monthName]
}
