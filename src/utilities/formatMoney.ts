interface FormatMoneyOptions {
  symbol?: string
  decimals?: number
  thousandSeparator?: string
  decimalSeparator?: string
  symbolPosition?: 'before' | 'after'
}

export function formatMoney(amount: number, options: FormatMoneyOptions = {}): string {
  const {
    symbol = '$',
    decimals = 2,
    thousandSeparator = ',',
    decimalSeparator = '.',
    symbolPosition = 'before',
  } = options

  const negativeSign = amount < 0 ? '-' : ''
  const absAmount = Math.abs(amount)
  const integerPart = Math.floor(absAmount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
  const decimalPart =
    decimals > 0 ? decimalSeparator + absAmount.toFixed(decimals).slice(-decimals) : ''
  const formattedAmount = integerPart + decimalPart

  return symbolPosition === 'before'
    ? `${negativeSign}${symbol}${formattedAmount}`
    : `${negativeSign}${formattedAmount}${symbol}`
}
