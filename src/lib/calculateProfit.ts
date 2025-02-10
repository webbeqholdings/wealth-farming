import {
    buildProfitRecordsAnnualy,
    buildProfitRecordsQuarterly,
    buildProfitRecordsSemester,
    buildProfitRecordsMonthly,
} from '@/lib/investment-products/dynamicFund'
import { format, getYear } from 'date-fns';

const calculateProfit = (term: string, availableBalance: any, startDate: Date, type: string) => {
    const parsedStartDate = new Date(startDate);
    const daysSinceStart = Math.floor((new Date().getTime() - parsedStartDate.getTime()) / (1000 * 60 * 60 * 24))
    let profitToday = 0;
    let balanceToday = availableBalance;

    // if (daysSinceStart <= 30 && daysSinceStart >= 0) {
    //     profitToday = (daysSinceStart * availableBalance * 20) / (255 * 100);
    //     balanceToday = availableBalance + profitToday;
    //     return type === 'profit' ? profitToday : balanceToday;
    // }
    if(daysSinceStart < 0){
        profitToday = 0;
        balanceToday = availableBalance;
        return type === 'profit' ? profitToday : balanceToday;
    }

    const today = new Date();
    let build;

    switch (term) {
        case 'annually':
            build = buildProfitRecordsAnnualy(availableBalance, parsedStartDate, today);
            break;
        case 'semester':
            build = buildProfitRecordsSemester(availableBalance, parsedStartDate, today);
            break;
        case 'quarterly':
            build = buildProfitRecordsQuarterly(availableBalance, parsedStartDate, today);
            break;
        case 'monthly':
            build = buildProfitRecordsMonthly(availableBalance, parsedStartDate, today);
            break;
        default:
            throw new Error(`Unknown term: ${term}`);
    }

    const year = getYear(today);
    const month = format(today, 'MM');

    const dateProfitFilter = build[year]?.filter((item: any) => format(item.date, 'MM') === month) || [];

    if (!dateProfitFilter.length) {
        return 0;
    }

    return type === 'profit' ? dateProfitFilter[0]?.profit : dateProfitFilter[0]?.balance;
};

export default calculateProfit;
