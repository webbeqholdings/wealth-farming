import { Term } from '@/lib/investment-products/dynamicFund'
import { format } from 'date-fns'
import { Bird } from 'lucide-react'
import { Separator } from '../ui/separator'
import { useTranslation } from 'react-i18next'

const ReportBack = ({
  amount,
  term,
  startDate,
  endDate,
  periods,
  dataExtra,
}: {
  amount: number
  term: Term
  startDate: Date
  endDate: Date
  periods: number
  dataExtra?: object
}) => {
  const { t } = useTranslation()
  let termDescriptionConfig = [
    {
      termKey: 'monthly',
      note: 'Mỗi cuối tháng dương lịch',
      termName: 'Hàng Tháng',
    },
    {
      termKey: 'quarterly',
      note: 'Kết thúc mỗi quý dương lịch, ví dụ Quý 2 (01/04 đến hết 30/6)',
      termName: 'Hàng Quý',
    },
    {
      termKey: 'semester',
      note: 'Kết thúc kì hạn nửa năm dương lịch (01/01 đến 31/05 & 01/06 đến hết 31/12)',
      termName: 'Nửa Năm Dương Lịch',
    },

    {
      termKey: 'annually',
      note: 'Kết thúc kì hạn 1 năm dương lịch (01/01 đến 31/12)',
      termName: 'Hàng Năm',
    },

    {
      termKey: 'BeforeStandard',
      note: '20% / năm',
      termName: 'Khi kết thúc hợp đồng trước 90 ngày',
    },
    {
      termKey: 'partialMonth',
      note: 'Ngày tham gia | Ngày kết thúc không trọn vẹn. Chỉ tính số ngày tham gia trong tháng đó',
      termName: 'Tháng không trọn vẹn',
    },
  ]

  let termDescription: any = termDescriptionConfig.filter((item) => {
    return item.termKey == term
  })[0]

  if (!startDate || !endDate) return '...'

  let yearsObject = (dataExtra as { profitData: any })?.profitData
  let years = Object.keys(yearsObject).length

  let canCancelContractAt = (dataExtra as { canCancelContractAt: any })?.canCancelContractAt
  let standardApplyProgramDays = (dataExtra as { standardApplyProgramDays: any })
    ?.standardApplyProgramDays

  let rateConfig = (dataExtra as { rateConfig: any })?.rateConfig

  return (
    <div className="mb-3">
      <h3 className="mt-8 mb-2 scroll-m-20 text-4xl font-semibold tracking-tight">
        {t('Mô tả thỏa thuận')}
      </h3>
      <div></div>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          {t('Tôi sẵn lòng đầu tư')} <span className="text-primary mx-1 font-semibold">{amount}</span> 
          {t('USD vào chương trình đầu tư BEQ Dynamic. Rút lãi với kì hạn')}
          <span className="text-primary mx-1 font-semibold">{t(termDescription.termName)}</span>
        </li>
        <li>
          {t('Mức lãi suất WF áp dụng')}
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {rateConfig.map((item: any) => {
              let _termDescription: any = termDescriptionConfig.filter((x) => {
                console.log('report back item', item)
                return x.termKey == item.term
              })[0]

              return (
                <li key={item.term}>
                  {t(_termDescription.termName)}{' '}
                  <span className=" mx-1 font-semibold">
                    {(item.rate_of_return * 100).toFixed(2)}{t('% / tháng trọn vẹn')}
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
          {t('Hợp Đồng của tôi bắt đầu từ ngày')}{' '}
          <span className="text-primary mx-1 font-semibold">
            {format(startDate, 'd MMM, yyyy')}
          </span>{' '}
          {t('đến')}
          <span className="text-primary mx-1 font-semibold">
            {format(endDate, 'd MMM, yyyy')}
          </span>{' '}
          {t('với')} <span className="text-primary mx-1 font-bold">{periods}</span> 
          {t('chu kì đầu tư, thời gian kéo dài trong vòng ')}
          <span className="text-primary mx-1 font-bold">{years} {t('năm')}</span>
        </li>
        <li>
          {t('Lãi suất của kì hạn được áp dụng khi tham gia tối thiểu')}{' '}
          <span className="text-primary mx-1 font-bold">{90}</span> {t('ngày')}
        </li>
        <li>
          {t('Lãi suất của kì hạn được áp dụng vào ngày')}
          <span className="text-primary mx-1 font-semibold">
            (thứ {standardApplyProgramDays + 1})
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
