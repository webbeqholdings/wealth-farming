import {
    buildProfitLogsAnnualy,
    buildProfitLogsQuarterly,
    buildProfitLogsSemester,
    buildProfitLogsMonthly,
} from '@/lib/investment-products/dynamicFund'
import { format, getYear } from 'date-fns';

const calculateProfit = async (term: string, availableBalance: any, startDate: Date, type: string) => {
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
            build = await buildProfitLogsAnnualy(availableBalance, parsedStartDate, today);
            break;
        case 'semester':
            build = await buildProfitLogsSemester(availableBalance, parsedStartDate, today);
            break;
        case 'quarterly':
            build = await buildProfitLogsQuarterly(availableBalance, parsedStartDate, today);
            break;
        case 'monthly':
            build = await buildProfitLogsMonthly(availableBalance, parsedStartDate, today);
            break;
        default:
            throw new Error(`Unknown term: ${term}`);
    }

    return type === 'profit' ? build?.profit : build?.balance;
};

export default calculateProfit;
