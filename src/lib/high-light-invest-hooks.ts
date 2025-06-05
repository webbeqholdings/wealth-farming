"use server"

import { getUsers, getContracts, getTransactions, getOverview } from "@/lib/high-light-googlesheet"

// Types based on your Google Sheets data structure
export interface User {
    User_Id: number
    Full_Name: string
    Nickname: string
    Phone: string
    Mail: string
    Gender: "MALE" | "FEMALE"
    Birth: string
    // Computed fields for UI compatibility
    id: string
    name: string
    email: string
    phone: string
    joinDate: string
    status: "active" | "pending" | "inactive"
    bio?: string
    address?: string
}

export interface Contract {
    Contract_ID: number
    User_Email: string
    User_Name: string
    Amount: number
    Product: string
    Profit_Rate: string
    Compound: string
    Start: string
    Status: string
    Note: string
    Fee: string
    // Computed fields for UI compatibility
    id: string
    title: string
    value: number
    startDate: string
    endDate: string
    status: "active" | "closed"
    client: string
    contactPerson: string
    contactEmail: string
    contactPhone: string
    description: string
    terms: string
    renewalOption: boolean
    userId?: string
}

export interface Transaction {
    Transaction_ID: number
    Contract_ID: number
    User_Email: string
    Type: "investment" | "withdraw" | "profit"
    Amount: number
    Date: string
    Description: string
    Status: string
    // Computed fields for UI compatibility
    id: string
    date: string
    type: "investment" | "withdraw" | "profit"
    amount: number
    description: string
    contractId: string
    userId?: string
}

export interface OverviewMetric {
    key: string
    label: string
    value: number
    note: string
}

export interface DashboardData {
    overviewMetrics: OverviewMetric[]
    users: User[]
    contracts: Contract[]
    transactions: Transaction[]
}

export interface FinancialData {
    totalInvestment: number
    totalWithdraw: number
    totalEarnings: number
    investmentChange: number
    withdrawChange: number
    earningsChange: number
}

// Helper function to transform Google Sheets user data to UI format
const transformUser = (userData: any): User => {
    const birthDate = userData.Birth ? new Date(userData.Birth) : null
    const joinDate = birthDate ? birthDate.toLocaleDateString() : "Unknown"

    return {
        ...userData,
        id: userData.User_Id.toString(),
        name: userData.Full_Name || userData.Nickname || "Unknown",
        email: userData.Mail || "",
        phone: userData.Phone || "",
        joinDate,
        status: "active", // Default status, you can add logic based on your business rules
        bio: `${userData.Gender} - ${userData.Nickname}`,
        address: "", // Not available in current data structure
    }
}

// Helper function to transform Google Sheets contract data to UI format
const transformContract = (contractData: any): Contract => {
    const startDate = contractData.Start ? new Date(contractData.Start).toLocaleDateString() : "Unknown"
    const endDate = "Ongoing" // Calculate based on your business logic

    return {
        ...contractData,
        id: contractData.Contract_ID.toString(),
        title: `${contractData.Product} Investment Contract`,
        value: contractData.Amount || 0,
        startDate,
        endDate,
        status: contractData.Status?.toLowerCase() === "active" ? "active" : "closed",
        client: contractData.User_Name || "Unknown Client",
        contactPerson: contractData.User_Name || "",
        contactEmail: contractData.User_Email || "",
        contactPhone: "", // Not available in current structure
        description: `${contractData.Product} investment with ${contractData.Profit_Rate} profit rate. ${contractData.Note || ""}`,
        terms: contractData.Product || "Standard",
        renewalOption: contractData.Compound === "Yes",
        userId: contractData.User_Email, // Using email as user identifier
    }
}

// Helper function to transform Google Sheets transaction data to UI format
const transformTransaction = (transactionData: any): Transaction => {
    const date = transactionData.Date ? new Date(transactionData.Date).toLocaleDateString() : "Unknown"

    return {
        ...transactionData,
        id: transactionData.Transaction_ID?.toString() || Math.random().toString(),
        date,
        type: transactionData.Type?.toLowerCase() || "investment",
        amount: transactionData.Amount || 0,
        description: transactionData.Description || `${transactionData.Type} transaction`,
        contractId: transactionData.Contract_ID?.toString() || "",
        userId: transactionData.User_Email,
    }
}

// Get dashboard data from Google Sheets
export const getDashboardData = async (): Promise<DashboardData> => {
    try {
        const [usersData, contractsData, transactionsData, overviewData] = await Promise.all([
            getUsers(),
            getContracts(),
            getTransactions(),
            getOverview(),
        ])

        // Transform the data to match our interface
        const users: User[] = usersData.map(transformUser)
        const contracts: Contract[] = contractsData.map(transformContract)
        const transactions: Transaction[] = transactionsData?.map(transformTransaction) || []
        const overviewMetrics: OverviewMetric[] = overviewData || []

        return {
            overviewMetrics,
            users,
            contracts,
            transactions,
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Return empty data structure on error
        return {
            overviewMetrics: [],
            users: [],
            contracts: [],
            transactions: [],
        }
    }
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
    const data = await getDashboardData()
    return data.users
}

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
    const users = await getAllUsers()
    return users.find((user) => user.id === id || user.email === id) || null
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const users = await getAllUsers()
    return users.find((user) => user.email === email) || null
}

// Get contract by ID
export const getContractById = async (id: string): Promise<Contract | null> => {
    const data = await getDashboardData()
    return data.contracts.find((contract) => contract.id === id) || null
}

// Get contracts by user email
export const getContractsByUserId = async (userId: string): Promise<Contract[]> => {
    const data = await getDashboardData()
    // Find user first to get email
    const user = await getUserById(userId)
    if (!user) return []

    return data.contracts.filter((contract) => contract.userId === user.email)
}

// Get contracts by user email directly
export const getContractsByUserEmail = async (userEmail: string): Promise<Contract[]> => {
    const data = await getDashboardData()
    return data.contracts.filter((contract) => contract.userId === userEmail)
}

// Get transactions by contract ID
export const getTransactionsByContractId = async (contractId: string): Promise<Transaction[]> => {
    const data = await getDashboardData()
    return data.transactions.filter((transaction) => transaction.contractId === contractId)
}

// Get transactions by user ID
export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
    const data = await getDashboardData()
    // Find user first to get email
    const user = await getUserById(userId)
    if (!user) return []

    return data.transactions.filter((transaction) => transaction.userId === user.email)
}

// Get transactions by user email directly
export const getTransactionsByUserEmail = async (userEmail: string): Promise<Transaction[]> => {
    const data = await getDashboardData()
    return data.transactions.filter((transaction) => transaction.userId === userEmail)
}

// Get all transactions
export const getAllTransactions = async (): Promise<Transaction[]> => {
    const data = await getDashboardData()
    return data.transactions
}

// Get user financial data
export const getUserFinancialData = async (userId: string): Promise<FinancialData> => {
    try {
        const user = await getUserById(userId)
        if (!user) {
            return {
                totalInvestment: 0,
                totalWithdraw: 0,
                totalEarnings: 0,
                investmentChange: 0,
                withdrawChange: 0,
                earningsChange: 0,
            }
        }

        const transactions = await getTransactionsByUserEmail(user.email)

        const totals = transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === "investment") {
                    acc.investment += transaction.amount
                } else if (transaction.type === "withdraw") {
                    acc.withdraw += transaction.amount
                } else if (transaction.type === "profit") {
                    acc.earnings += transaction.amount
                }
                return acc
            },
            { investment: 0, withdraw: 0, earnings: 0 },
        )

        return {
            totalInvestment: totals.investment,
            totalWithdraw: totals.withdraw,
            totalEarnings: totals.earnings,
            investmentChange: 5, // Mock data - you can calculate based on historical data
            withdrawChange: -2,
            earningsChange: 10,
        }
    } catch (error) {
        console.error("Error fetching user financial data:", error)
        return {
            totalInvestment: 0,
            totalWithdraw: 0,
            totalEarnings: 0,
            investmentChange: 0,
            withdrawChange: 0,
            earningsChange: 0,
        }
    }
}

// Get contract equity data
export const getContractEquityData = async (contractId: string) => {
    try {
        const contract = await getContractById(contractId)
        if (!contract) return []

        // Mock equity data - you can implement real calculation based on your business logic
        const startDate = new Date(contract.Start)
        const monthlyData = []

        for (let i = 0; i < 6; i++) {
            const month = new Date(startDate)
            month.setMonth(month.getMonth() + i)

            const profitRate = Number.parseFloat(contract.Profit_Rate.replace("%", "").replace(",", ".")) / 100
            const monthlyProfit = contract.value * profitRate
            const totalValue = contract.value + monthlyProfit * (i + 1)

            monthlyData.push({
                month: month.toLocaleDateString("en-US", { month: "short" }),
                value: Math.round(totalValue),
            })
        }

        return monthlyData
    } catch (error) {
        console.error("Error fetching contract equity data:", error)
        return []
    }
}

// Get user equity data
export const getUserEquityData = async (userId: string) => {
    try {
        const user = await getUserById(userId)
        if (!user) return []

        const contracts = await getContractsByUserEmail(user.email)

        // Calculate combined equity across all user contracts
        const monthlyData = []

        for (let i = 0; i < 6; i++) {
            const month = new Date()
            month.setMonth(month.getMonth() - (5 - i))

            let totalEquity = 0
            contracts.forEach((contract) => {
                const profitRate = Number.parseFloat(contract.Profit_Rate.replace("%", "").replace(",", ".")) / 100
                const monthlyProfit = contract.value * profitRate
                totalEquity += contract.value + monthlyProfit * (i + 1)
            })

            monthlyData.push({
                month: month.toLocaleDateString("en-US", { month: "short" }),
                equity: Math.round(totalEquity),
            })
        }

        return monthlyData
    } catch (error) {
        console.error("Error fetching user equity data:", error)
        return []
    }
}
