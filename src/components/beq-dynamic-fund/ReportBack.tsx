import { Term } from '@/lib/investment-products/dynamicFund'
import { format } from 'date-fns'
import { Bird } from 'lucide-react'
import { useDynamicFundData } from '@/components/beq-dynamic-fund/DataProvider'
import { Separator } from '../ui/separator'
import { useTranslation } from 'react-i18next'

const ReportBack = () => {
  const { t } = useTranslation()
  const { data } = useDynamicFundData()
  const {
    productId,
    startDate,
    endDate,
    contractEndAt,
    canCancelContractAt,
    periods,
    profitData,
    productSelected,
    amount,
    publicProducts,
  } = data
  if (!startDate || !endDate || !productSelected) return ''

  let termDescriptionConfig = [
    {
      termKey: 'monthly',
      note: t('end_of_each_calendar_month'),
      termName: t('monthly'),
    },
    {
      termKey: 'quarterly',
      note: t('end_of_each_quarter'),
      termName: t('quarterly'),
    },
    {
      termKey: 'semester',
      note: t('end_of_six_month_term'),
      termName: t('semesterly'),
    },

    {
      termKey: 'annually',
      note: t('end_of_one_year_term'),
      termName: t('annually'),
    },

    {
      termKey: 'BeforeStandard',
      note: t('twenty_percent_per_year'),
      termName: t('before_standard'),
    },
    {
      termKey: 'partialMonth',
      note: t('incomplete_join_end_date'),
      termName: t('partial_month'),
    },
  ]

  let termDescription: any = termDescriptionConfig.find((item) => {
    return item.termKey == productSelected.term
  })

  console.log('termDescription', termDescription)
  console.log('productSelected.term', productSelected)

  let yearsObject = profitData
  let years = Object.keys(yearsObject).length

  let standardApplyProgramDays = 90

  return (
    <div className="mb-3">
      <h3 className="mt-8 mb-2 scroll-m-20 text-4xl font-semibold tracking-tight">
        {t('agreement_description')}
      </h3>
      <div></div>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          {t('willing_to_invest')} <span className="text-primary mx-1 font-semibold">{amount}</span> 
          {t('usd_investment_program')}
          <span className="text-primary mx-1 font-semibold">{t(termDescription.termName)}</span>
        </li>
        <li>
          {t('wf_interest_rate_applied')}
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {publicProducts.map((item: any) => {
              let _termDescription: any = termDescriptionConfig.filter((x) => {
                return x.termKey == item.term
              })[0]

              return (
                <li key={item.term}>
                  {t(_termDescription.termName)}{' '}
                  <span className=" mx-1 font-semibold">
                    {(item.rate_of_return * 100).toFixed(2)}{t('percent_full_month')}
                  </span>
                  <div className="text-gray-400">
                    <Bird className="inline" /> {t(_termDescription.note)}
                  </div>
                </li>
              )
            })}
          </ul>
        </li>
        <li>
          {t('my_contract_starts_from')}{' '}
          <span className="text-primary mx-1 font-semibold">
            {format(startDate, 'd MMM, yyyy')}
          </span>{' '}
          {t('to')}
          <span className="text-primary mx-1 font-semibold">
            {format(endDate, 'd MMM, yyyy')}
          </span>{' '}
          {t('with')} <span className="text-primary mx-1 font-bold">{periods}</span> 
          {t('investment_period')}
          <span className="text-primary mx-1 font-bold">{years} {t('năm')}</span>
        </li>
        <li>
          {t('interest_rate_minimum')}{' '}
          <span className="text-primary mx-1 font-bold">{standardApplyProgramDays}</span> {t('day')}
        </li>
        <li>
          {t('interest_rate_on_date')}
          <span className="text-primary mx-1 font-semibold">
            ({t('day_num', {num: standardApplyProgramDays + 1})})
          </span>
          <span className="text-primary mx-1 font-semibold">
            {format(canCancelContractAt, 'd MMM, yyyy')}
          </span>
        </li>
      </ul>
    </div>
  )
}
export default ReportBack
