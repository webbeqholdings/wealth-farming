import { formatDateTime } from "@/utilities/formatDateTime";
// Create a function to make the API request
export async function notifyDeposit(data: any) {
    try {
        const response = await fetch('https://dev.bot.alert.wealthfarming.org/api/notify-deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify({
                userName: data.user.first_name + ' ' + data.user.last_name,
                email: data.user.email,
                amount: data.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
                paymentMethod: "Bank Transfer",
                requestTime: formatDateTime(`${new Date()}`),
                depositId: data.id,
            }), // Convert the request body to JSON
        });

        return response; // Return the parsed data for further use
    } catch (error) {
        console.error("Error during notifyDeposit API call:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

export async function notifyWithdrawl(data: any) {
    try {
        const response = await fetch('https://dev.bot.alert.wealthfarming.org/api/notify-withdrawl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify({
                userName: data.user.first_name + ' ' + data.user.last_name,
                email: data.user.email,
                amount: data.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
                paymentMethod: "Bank Transfer",
                requestTime: formatDateTime(`${new Date()}`),
                withdrawlId: data.id,
            }), // Convert the request body to JSON
        });

        return response; // Return the parsed data for further use
    } catch (error) {
        console.error("Error during notifyDeposit API call:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

export async function notifyInvestment(data: any) {
    try {
        const response = await fetch('https://dev.bot.alert.wealthfarming.org/api/notify-investment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify({
                userName: data.user.first_name + ' ' + data.user.last_name,
                email: data.user.email,
                amount: data.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
                requestTime: formatDateTime(`${new Date()}`),
                depositId: data.id,
                productLog: data.product_log,
                startDate: data.start_date,
                endDate: data.end_date,
                term: data.term,
                expectedReturn: data.expected_return.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })
            }), // Convert the request body to JSON
        });
        return response; // Return the parsed data for further use
    } catch (error) {
        console.error("Error during notifyDeposit API call:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

export async function notifyWithdrawlContracts(data: any) {
    try {
        const response = await fetch('https://dev.bot.alert.wealthfarming.org/api/notify-withdrawl-contracts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify({
                userName: data.user.first_name + ' ' + data.user.last_name,
                email: data.user.email,
                amount: data.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
                requestTime: formatDateTime(`${new Date()}`),
                withdrawlId: data.id,
                productLog: data.contract.product_log,
                startDate: data.contract.start_date,
                endDate: data.contract.end_date,
                term: data.contract.term,
                profit: data.contract.profit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
                balance: data.contract.balance.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
                investmentAmount: data.contract.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })
            }), // Convert the request body to JSON
        });

        return response; // Return the parsed data for further use
    } catch (error) {
        console.error("Error during notifyDeposit API call:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

