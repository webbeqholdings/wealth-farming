// @ts-nocheck
import {
  getYear,
  isSameYear,
  format,
  eachMonthOfInterval,
  endOfMonth,
  getMonth,
  addMonths,
  startOfMonth,
  differenceInDays,
  isWeekend,
  getDaysInMonth,
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
  return format(date, 'dd') == '01'
}

export function isEndOfMonth(date: Date): boolean {
  return format(date, 'dd') === format(endOfMonth(date), 'dd')
}

export function isSameMonthYear(startDate: Date, endDate: Date) {
  return format(startDate, 'MM') == format(endDate, 'MM') && getYear(startDate) == getYear(endDate)
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

// return only valid Months
export function findTermMonthly(startDate: Date, endDate: Date): boolean | object {
  const rateMonthly = 0.0595
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  const genderName = 'Monthly'

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  if (!listOfMonths.length) return false

  const result = []

  for (let yearItem of listOfMonths) {
    let tradingDaysMatcher: any = []

    for (let tradingMonth of yearItem.months) {
      tradingDaysMatcher.push({
        month: tradingMonth,
        days: findMarketTradingDays(tradingMonth, yearItem.year),
        rate: rateMonthly,
        valid: true,
        gender: genderName,
      })
    }

    tradingDaysMatcher.sort((a, b) => a.month - b.month)
    result.push({
      year: yearItem.year,
      tradingDaysLayer: tradingDaysMatcher,
    })
  }

  if (!result.length) return false

  return { result: result }
}

export function findTermQuarterly(startDate: Date, endDate: Date): boolean | object {
  const rateQuarterly = 0.0615
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  const genderName = 'Quarterly'

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const result = []

  for (let yearItem of listOfMonths) {
    let tradingDaysMatcher: any = []

    if (isSubArrayContained(['01', '02', '03'], yearItem.months)) {
      for (let tradingMonth of ['01', '02', '03']) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateQuarterly,
          valid: true,
          gender: genderName,
        })
      }

      yearItem.months = removeSubArray(yearItem.months, ['01', '02', '03'])
    }

    if (isSubArrayContained(['04', '05', '06'], yearItem.months)) {
      for (let tradingMonth of ['04', '05', '06']) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateQuarterly,
          valid: true,
          gender: genderName,
        })
      }
      yearItem.months = removeSubArray(yearItem.months, ['04', '05', '06'])
    }

    if (isSubArrayContained(['07', '08', '09'], yearItem.months)) {
      for (let tradingMonth of ['07', '08', '09']) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateQuarterly,
          valid: true,
          gender: genderName,
        })
      }
      yearItem.months = removeSubArray(yearItem.months, ['07', '08', '09'])
    }

    if (isSubArrayContained(['10', '11', '12'], yearItem.months)) {
      for (let tradingMonth of ['10', '11', '12']) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateQuarterly,
          valid: true,
          gender: genderName,
        })
      }
      yearItem.months = removeSubArray(yearItem.months, ['10', '11', '12'])
    }

    if (yearItem.months.length) {
      for (let _badMonth of yearItem.months) {
        tradingDaysMatcher.push({
          month: _badMonth,
          days: findMarketTradingDays(_badMonth, yearItem.year),
          rate: 0,
          valid: false,
          gender: 'Monthly',
        })
      }
    }
    // HANDLE OFFSET MONTHS
    tradingDaysMatcher.sort((a, b) => a.month - b.month)
    result.push({
      year: yearItem.year,
      tradingDaysLayer: tradingDaysMatcher,
    })
  }

  if (!result.length) return false

  return { result: result }
}

export function findTermSemester(startDate: Date, endDate: Date): boolean | object {
  const rateSemester = 0.0635
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  const genderName = 'Semester'

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  const result = []

  for (let yearItem of listOfMonths) {
    let tradingDaysMatcher: any = []
    let isExistSemesterFirst = false
    let isExistSemesterLast = false

    if (isSubArrayContained(['01', '02', '03', '04', '05', '06'], yearItem.months)) {
      isExistSemesterFirst = true
      for (let tradingMonth of ['01', '02', '03', '04', '05', '06']) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateSemester,
          valid: true,
          gender: genderName,
        })
      }
    }

    if (isSubArrayContained(['07', '08', '09', '10', '11', '12'], yearItem.months)) {
      isExistSemesterLast = true
      for (let tradingMonth of ['07', '08', '09', '10', '11', '12']) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateSemester,
          valid: true,
          gender: genderName,
        })
      }
    }

    let semesterAt = 'none'
    if (isExistSemesterFirst && !isExistSemesterLast) {
      semesterAt = 'first'
      for (let _mm of yearItem.months) {
        if (!['01', '02', '03', '04', '05', '06'].includes(_mm)) {
          tradingDaysMatcher.push({
            month: _mm,
            days: findMarketTradingDays(_mm, yearItem.year),
            rate: 0,
            valid: false,
            gender: genderName + ' Fail',
          })
        }
      }
    }

    if (!isExistSemesterFirst && isExistSemesterLast) {
      semesterAt = 'last'
      for (let _mm of yearItem.months) {
        if (!['07', '08', '09', '10', '11', '12'].includes(_mm)) {
          tradingDaysMatcher.push({
            month: _mm,
            days: findMarketTradingDays(_mm, yearItem.year),
            rate: 0,
            valid: false,
            gender: genderName + ' Fail',
          })
        }
      }
    }

    if (!isExistSemesterFirst && !isExistSemesterLast) {
      for (let _mm of yearItem.months) {
        tradingDaysMatcher.push({
          month: _mm,
          days: findMarketTradingDays(_mm, yearItem.year),
          rate: 0,
          valid: false,
          gender: genderName + ' Fail',
        })
      }
    }

    if (isExistSemesterFirst && isExistSemesterLast) {
      semesterAt = 'full'
    }
    tradingDaysMatcher.sort((a, b) => a.month - b.month)
    result.push({
      year: yearItem.year,
      tradingDaysLayer: tradingDaysMatcher,
      semesterAt: semesterAt,
    })
  }

  if (!result.length) return false

  return { result: result }
}

export function findTermAnnualy(startDate: Date, endDate: Date): boolean | object {
  const defineAnnualy = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const genderName = 'Annually'
  const listOfMonths = getMonthsBetweenYears(startDate, endDate)
  const rateAnnualy = 0.0655
  const result = []

  if (!isStartOfMonth(startDate)) {
    listOfMonths[0].months.shift()
  }

  if (!isEndOfMonth(endDate)) {
    listOfMonths[listOfMonths.length - 1].months.pop()
  }

  for (let yearItem of listOfMonths) {
    //let monthsMatcher = []
    let tradingDaysMatcher = []

    // if : Annualy is true
    if (isSubArrayContained(defineAnnualy, yearItem.months)) {
      // monthsMatcher.push(defineAnnualy)

      for (let tradingMonth of defineAnnualy) {
        tradingDaysMatcher.push({
          month: tradingMonth,
          days: findMarketTradingDays(tradingMonth, yearItem.year),
          rate: rateAnnualy,
          isValid: true,
          gender: genderName,
        })
      }

      result.push({
        year: yearItem.year,
        tradingDaysLayer: tradingDaysMatcher,
        isValid: true,
        gender: genderName,
      })

      continue
    }

    result.push({
      year: yearItem.year,
      tradingDaysLayer: [],
      isValid: false,
    })
  }

  if (!result.length) return false

  return { result: result }
}

export function findMarketTradingDays(_month: string, _year: string | number) {
  const data = dataMarketWorkingDays
  let monthName = format(new Date(`${_year}-${_month}-01`), 'LLL')

  if (_year > 2026) {
    _year = 2026
  }

  if (_year < 2024) {
    _year = 2024
  }

  // excute > 2026
  // @ts-ignore
  return data[_year].months[monthName]
}

export function getTradingDaysStartOrEnd(startDate: Date, endDate: Date): object {
  const result = {
    startDate: 0,
    endDate: 0,
    isSameMonthYear: false,
    daysInSameMonthYear: 0,
  }

  if (isSameMonthYear(startDate, endDate)) {
    result.isSameMonthYear = true
    result.daysInSameMonthYear = differenceInDaysNotWeekend(startDate, endDate)

    return result
  }

  if (!isStartOfMonth(startDate)) {
    let year = getYear(startDate)
    let month = format(startDate, 'MM')

    if (year > 2026) {
      year = 2026
    }

    if (year < 2024) {
      year = 2024
    }

    let offsetDays = differenceInDaysNotWeekend(new Date(`${year}-${month}-01`), startDate) - 1
    let tradingDays = findMarketTradingDays(month, year) - offsetDays
    result.startDate = tradingDays
  }

  if (!isEndOfMonth(endDate)) {
    let year = getYear(endDate)
    let daysInMonth = getDaysInMonth(endDate)
    let month = format(endDate, 'MM')
    let offsetDays =
      differenceInDaysNotWeekend(endDate, new Date(`${year}-${month}-${daysInMonth}`)) - 1
    let tradingDays = findMarketTradingDays(month, year) - offsetDays
    result.endDate = tradingDays
  }

  return result
}

export function differenceInDaysNotWeekend(startDate: Date, endDate: Date) {
  // Ensure startDate is not after endDate
  if (startDate > endDate) {
    ;[startDate, endDate] = [endDate, startDate]
  }

  let days = 0
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      days++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

export function removeSubArray(mainArray: string[], subArray: string[]) {
  if (subArray.length === 0) return mainArray.slice()

  for (let i = 0; i <= mainArray.length - subArray.length; i++) {
    if (
      mainArray.slice(i, i + subArray.length).every((element, index) => element === subArray[index])
    ) {
      return [...mainArray.slice(0, i), ...mainArray.slice(i + subArray.length)]
    }
  }

  return mainArray.slice()
}
