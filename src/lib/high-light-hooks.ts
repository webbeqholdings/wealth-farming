import {
  getContracts,
  getContractsByUser,
  getActiveContractsCount,
  getTotalBonusByUser,
  getTotalInvestment,
  getUsers,
  getUsersCount,
  getUser,
  getTransactionsByUser,
  getContract,
  getTotalInvestmentByUser,
  getTotalWithdrawByUser,
  getContractsCountByUser
} from '@/lib/highlight'

// Types for our data models
import {
  buildProfitLogsAnnualy,
  buildProfitLogsSemester,
  buildProfitLogsQuarterly,
  buildProfitLogsMonthly,
} from '@/lib/investment-products/dynamicFund'
import { format } from 'date-fns'
export interface User {
  id: string
  name: string
  email: string
  status: string
  role: string
  lastActive: string
  phone: string
  address: string
  joinDate: string
  bio: string
  totalInvestment: number
  contractsCount: number
}

export interface Contract {
  id: string
  userId: string
  title: string
  value: number
  startDate: string
  endDate: string
  status: string
  description: string
  client: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  terms: string
  renewalOption: boolean
}

export interface Transaction {
  id: string
  contractId: string
  userId?: number
  date: string
  amount: number
  type: 'bonus' | 'withdraw' | 'investment' | 'deposit'
  description: string
}

export interface FinancialData {
  userId: string
  totalInvestment: number
  totalWithdraw: number
  totalEarnings: number
  investmentChange: number
  withdrawChange: number
  earningsChange: number
}

export interface DashboardData {
  users: User[]
  contracts: Contract[]
  transactions: Transaction[]
  metrics: {
    totalRevenue: number
    activeUsers: number
    activeContracts: number
    avgResponseTime: string
    revenueChange: number
    userChange: number
    contractChange: number
    responseTimeChange: number
  }
}

// Fetch all dashboard data
export async function getDashboardData(): Promise<DashboardData> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch('https://your-payload-cms.com/api/dashboard')
  const users = await getAllUsers()
  const contracts = await getAllContracts()
  const totalRevenue = await getTotalInvestment()
  const activeUsers = await getUsersCount()
  const activeContracts = await getActiveContractsCount()

  // For now, we'll return mock data
  return {
    users: users,
    contracts: contracts,
    transactions: sampleTransactions,
    metrics: {
      totalRevenue: totalRevenue,
      activeUsers: activeUsers,
      activeContracts: activeContracts,
      avgResponseTime: '1.2h',
      revenueChange: 0,
      userChange: 0,
      contractChange: 0,
      responseTimeChange: -0.5,
    },
  }
}

// Fetch a specific user by ID
export async function getUserById(id: string): Promise<User | null> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/users/${id}`)

  // For now, we'll return mock data
  const { docs } = await getUser(Number(id))
  const user = {
    id: docs.id,
    name: `${docs.firstName} ${docs.lastName}`,
    email: docs.email,
    status: 'Active',
    role: docs.role,
    lastActive: '',
    phone: docs.phone || 'No Update',
    address: 'No update',
    joinDate: format(docs.createdAt, 'PP'),
    bio: '',
    totalInvestment: 0,
    contractsCount: 0
  }
  return user
}

// Fetch all users
export async function getAllUsers(): Promise<User[]> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch('https://your-payload-cms.com/api/users')
  const { docs } = await getUsers()
  // Use Promise.all to handle all async operations in parallel
  const users = await Promise.all(docs.map(async (user: any) => {
    // Await the async functions
    const contractsCount = await getContractsCountByUser(user.id)
    const totalInvestment = await getTotalInvestmentByUser(user.id)

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      status: 'Active',
      role: user.role,
      lastActive: '',
      phone: user.phone || 'No Update',
      address: 'No update',
      joinDate: format(user.createdAt, 'PP'),
      bio: '',
      totalInvestment: totalInvestment,
      contractsCount: contractsCount
    }
  }))
  // For now, we'll return mock data
  return users
}

// Fetch a specific contract by ID
export async function getContractById(id: string): Promise<Contract | null> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/contracts/${id}`)

  const { docs } = await getContract(Number(id))
  const user = await getUserById(docs.userId)
  const contract = {
    id: docs.id,
    userId: docs.userId,
    title: docs?.productName || '',
    value: docs.investedAmount,
    startDate: format(docs.startDate, 'PP'),
    endDate: format(docs.endDate, 'PP'),
    status: docs.status,
    description: 'No Update',
    client: user?.name, 
    contactPerson: user?.name || 'No Update',
    contactEmail: user?.email || 'No Update',
    contactPhone: user?.phone || 'No Update',
    terms: docs.term,
    renewalOption: false,
  }
  // For now, we'll return mock data
  return contract
}

// Fetch transactions for a specific contract
export async function getTransactionsByContractId(contractId: string): Promise<Transaction[]> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/transactions?contractId=${contractId}`)

  // For now, we'll return mock data
  return sampleTransactions.filter((transaction) => transaction.contractId === contractId)
}

// Fetch transactions for a specific user
export async function getTransactionsByUserId(userId: number): Promise<Transaction[]> {
  const { docs } = await getTransactionsByUser(userId)
  const transactions = docs.map((transaction: any) => {
    return {
      id: transaction.id,
      contractId: '',
      userId: '',
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.note || 'No Update',
    }
  })
  return transactions
}

// Fetch financial data for a user
export async function getUserFinancialData(userId: string): Promise<FinancialData | null> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/financial?userId=${userId}`)

  const totalInvestmentByUser = await getTotalInvestmentByUser(Number(userId))
  const totalWithdrawByUser = await getTotalWithdrawByUser(Number(userId))
  const totalBonusByUser = await getTotalBonusByUser(Number(userId))
  return {
    userId: userId,
    totalInvestment: totalInvestmentByUser,
    totalWithdraw: totalWithdrawByUser,
    totalEarnings: totalBonusByUser,
    investmentChange: 0,
    withdrawChange: 0,
    earningsChange: 0,
  }
}

// Fetch equity data for a user
export async function getUserEquityData(userId: string) {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/equity?userId=${userId}`)

  // For now, we'll return mock data
  const userData = userEquityData.find((data) => data.userId === userId)
  return userData?.data || []
}

// Fetch equity data for a contract
export async function getContractEquityData(contractId: string) {
  const contract = await getContractById(contractId)
  // find Contract infomation
  let contract_amount = contract.value // contract.amount
  let start_date = new Date(contract.startDate)
  let end_date
  if (contract.status == 'active') {
    end_date = new Date(new Date().setDate(new Date().getDate() - 1)) // Yesterday
  } else end_date = new Date(contract.endDate)
  
  let profitData 

  if (contract.terms == 'annually') {
    profitData = await buildProfitLogsAnnualy(contract_amount, start_date, end_date)
  }

  if (contract.terms == 'semester') {
    profitData = await buildProfitLogsSemester(contract_amount, start_date, end_date)
  }

  if (contract.terms == 'quarterly') {
    profitData = await buildProfitLogsQuarterly(contract_amount, start_date, end_date)
  }

  if (contract.terms == 'monthly') {
    profitData = await buildProfitLogsMonthly(contract_amount, start_date, end_date)
  }

  // const logs = await buildProfitLogsAnnualy(contract_amount, start_date, end_date)
  const chartData = profitData.profitLogs.map((item: any) => {
    return {
      month: format(item.toDate, 'PP'),
      value: item.balance,
    }
  })

  // const contractData = contractEquityData.find((data) => data.contractId === contractId)
  return chartData || []
}

// Fetch contracts for a specific user
export async function getAllContracts(): Promise<Contract[]> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/contracts?userId=${userId}`)

  const { docs } = await getContracts()
  const contracts = docs.map((contract: any) => {
    return {
      id: contract.id,
      userId: contract.userId,
      title: contract?.productName,
      value: contract.investedAmount,
      startDate: format(contract.startDate, 'PP'),
      endDate: contract.endDate ? format(contract.endDate, 'PP') : '',
      status: contract.status,
      description: 'No Update',
      client: contract?.productName,
      contactPerson: 'No Update',
      contactEmail: 'No Update',
      contactPhone: 'No Update',
      terms: contract.term,
      renewalOption: 'No Update',
    }
  })
  // For now, we'll return mock data
  return contracts
}

// Fetch contracts for a specific user
export async function getContractsByUserId(userId: string): Promise<Contract[]> {
  // In a real app, you would fetch this from Payload CMS
  // Example: const response = await fetch(`https://your-payload-cms.com/api/contracts?userId=${userId}`)

  const { docs } = await getContractsByUser(Number(userId))
  const contracts = docs.map((contract: any) => {
    return {
      id: contract.id,
      userId: contract.userId,
      title: contract?.productName,
      value: contract.investedAmount,
      startDate: format(contract.startDate, 'PP'),
      endDate: format(contract.endDate, 'PP'),
      status: contract.status,
      description: 'No Update',
      client: '',
      contactPerson: 'No Update',
      contactEmail: 'No Update',
      contactPhone: 'No Update',
      terms: contract.term,
      renewalOption: 'No Update',
    }
  })
  // For now, we'll return mock data
  return contracts
}

// // Sample data - in a real app, this would come from Payload CMS
// const sampleUsers: User[] = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     status: 'Active',
//     role: 'Admin',
//     lastActive: 'Just now',
//     phone: '+1 (555) 123-4567',
//     address: '123 Main St, New York, NY 10001',
//     joinDate: 'Jan 15, 2022',
//     bio: 'Senior administrator with expertise in system management and team leadership.',
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     email: 'jane.smith@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '5 min ago',
//     phone: '+1 (555) 987-6543',
//     address: '456 Park Ave, Boston, MA 02108',
//     joinDate: 'Mar 22, 2022',
//     bio: 'Marketing specialist with a focus on digital campaigns and brand development.',
//   },
//   {
//     id: '3',
//     name: 'Robert Johnson',
//     email: 'robert.johnson@example.com',
//     status: 'Inactive',
//     role: 'User',
//     lastActive: '3 hours ago',
//     phone: '+1 (555) 234-5678',
//     address: '789 Oak St, Chicago, IL 60601',
//     joinDate: 'Apr 10, 2022',
//     bio: 'Product development expert with experience in agile methodologies.',
//   },
//   {
//     id: '4',
//     name: 'Emily Davis',
//     email: 'emily.davis@example.com',
//     status: 'Active',
//     role: 'Manager',
//     lastActive: '1 day ago',
//     phone: '+1 (555) 345-6789',
//     address: '321 Pine St, San Francisco, CA 94101',
//     joinDate: 'May 5, 2022',
//     bio: 'Team manager with a track record of successful project deliveries.',
//   },
//   {
//     id: '5',
//     name: 'Michael Wilson',
//     email: 'michael.wilson@example.com',
//     status: 'Suspended',
//     role: 'User',
//     lastActive: '1 week ago',
//     phone: '+1 (555) 456-7890',
//     address: '654 Maple St, Seattle, WA 98101',
//     joinDate: 'Jun 15, 2022',
//     bio: 'Technical specialist focusing on infrastructure and cloud solutions.',
//   },
//   {
//     id: '6',
//     name: 'Sarah Brown',
//     email: 'sarah.brown@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '2 days ago',
//     phone: '+1 (555) 567-8901',
//     address: '987 Cedar St, Austin, TX 78701',
//     joinDate: 'Jul 3, 2022',
//     bio: 'Content strategist with expertise in SEO and digital marketing.',
//   },
//   {
//     id: '7',
//     name: 'David Miller',
//     email: 'david.miller@example.com',
//     status: 'Active',
//     role: 'Admin',
//     lastActive: '4 hours ago',
//     phone: '+1 (555) 678-9012',
//     address: '246 Elm St, Denver, CO 80202',
//     joinDate: 'Aug 12, 2022',
//     bio: 'Systems administrator with a focus on network security and cloud infrastructure.',
//   },
//   {
//     id: '8',
//     name: 'Lisa Taylor',
//     email: 'lisa.taylor@example.com',
//     status: 'Inactive',
//     role: 'User',
//     lastActive: '2 weeks ago',
//     phone: '+1 (555) 789-0123',
//     address: '135 Birch St, Portland, OR 97201',
//     joinDate: 'Sep 8, 2022',
//     bio: 'UX designer specializing in user research and interface design.',
//   },
//   {
//     id: '9',
//     name: 'James Anderson',
//     email: 'james.anderson@example.com',
//     status: 'Active',
//     role: 'Manager',
//     lastActive: 'Yesterday',
//     phone: '+1 (555) 890-1234',
//     address: '864 Pine St, Miami, FL 33101',
//     joinDate: 'Oct 20, 2022',
//     bio: 'Project manager with expertise in agile methodologies and team leadership.',
//   },
//   {
//     id: '10',
//     name: 'Jennifer Thomas',
//     email: 'jennifer.thomas@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: 'Just now',
//     phone: '+1 (555) 901-2345',
//     address: '753 Oak St, Atlanta, GA 30303',
//     joinDate: 'Nov 15, 2022',
//     bio: 'Content creator specializing in video production and social media strategy.',
//   },
//   {
//     id: '11',
//     name: 'Richard Harris',
//     email: 'richard.harris@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '3 days ago',
//     phone: '+1 (555) 012-3456',
//     address: '642 Maple St, Phoenix, AZ 85001',
//     joinDate: 'Dec 5, 2022',
//     bio: 'Data analyst with expertise in business intelligence and data visualization.',
//   },
//   {
//     id: '12',
//     name: 'Patricia Martin',
//     email: 'patricia.martin@example.com',
//     status: 'Inactive',
//     role: 'User',
//     lastActive: '1 week ago',
//     phone: '+1 (555) 123-4567',
//     address: '531 Cedar St, Philadelphia, PA 19102',
//     joinDate: 'Jan 10, 2023',
//     bio: 'HR specialist focusing on employee engagement and talent acquisition.',
//   },
//   {
//     id: '13',
//     name: 'Thomas Jackson',
//     email: 'thomas.jackson@example.com',
//     status: 'Active',
//     role: 'Manager',
//     lastActive: '12 hours ago',
//     phone: '+1 (555) 234-5678',
//     address: '420 Elm St, Las Vegas, NV 89101',
//     joinDate: 'Feb 18, 2023',
//     bio: 'Operations manager with experience in process optimization and team coordination.',
//   },
//   {
//     id: '14',
//     name: 'Barbara White',
//     email: 'barbara.white@example.com',
//     status: 'Suspended',
//     role: 'User',
//     lastActive: '3 weeks ago',
//     phone: '+1 (555) 345-6789',
//     address: '319 Birch St, Nashville, TN 37201',
//     joinDate: 'Mar 25, 2023',
//     bio: 'Financial analyst specializing in budget planning and financial forecasting.',
//   },
//   {
//     id: '15',
//     name: 'Charles Lee',
//     email: 'charles.lee@example.com',
//     status: 'Active',
//     role: 'Admin',
//     lastActive: '2 days ago',
//     phone: '+1 (555) 456-7890',
//     address: '208 Pine St, San Diego, CA 92101',
//     joinDate: 'Apr 12, 2023',
//     bio: 'IT security specialist with expertise in cybersecurity and risk management.',
//   },
//   {
//     id: '16',
//     name: 'Susan Walker',
//     email: 'susan.walker@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '6 hours ago',
//     phone: '+1 (555) 567-8901',
//     address: '197 Oak St, Charlotte, NC 28202',
//     joinDate: 'May 8, 2023',
//     bio: 'Marketing coordinator with experience in campaign management and analytics.',
//   },
//   {
//     id: '17',
//     name: 'Joseph Hall',
//     email: 'joseph.hall@example.com',
//     status: 'Inactive',
//     role: 'User',
//     lastActive: '5 days ago',
//     phone: '+1 (555) 678-9012',
//     address: '186 Maple St, Indianapolis, IN 46204',
//     joinDate: 'Jun 15, 2023',
//     bio: 'Sales representative with a track record of exceeding targets and building client relationships.',
//   },
//   {
//     id: '18',
//     name: 'Jessica Allen',
//     email: 'jessica.allen@example.com',
//     status: 'Active',
//     role: 'Manager',
//     lastActive: 'Yesterday',
//     phone: '+1 (555) 789-0123',
//     address: '175 Cedar St, Columbus, OH 43215',
//     joinDate: 'Jul 22, 2023',
//     bio: 'Product manager specializing in software development and user experience design.',
//   },
//   {
//     id: '19',
//     name: 'Christopher Young',
//     email: 'christopher.young@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '4 days ago',
//     phone: '+1 (555) 890-1234',
//     address: '164 Elm St, Detroit, MI 48226',
//     joinDate: 'Aug 10, 2023',
//     bio: 'Customer support specialist with expertise in client satisfaction and problem resolution.',
//   },
//   {
//     id: '20',
//     name: 'Margaret King',
//     email: 'margaret.king@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: 'Today',
//     phone: '+1 (555) 901-2345',
//     address: '153 Birch St, Baltimore, MD 21202',
//     joinDate: 'Sep 5, 2023',
//     bio: 'Content writer specializing in technical documentation and blog articles.',
//   },
//   {
//     id: '21',
//     name: 'Daniel Wright',
//     email: 'daniel.wright@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '2 hours ago',
//     phone: '+1 (555) 012-3456',
//     address: '142 Pine St, Albuquerque, NM 87102',
//     joinDate: 'Oct 18, 2023',
//     bio: 'Web developer with expertise in front-end technologies and responsive design.',
//   },
//   {
//     id: '22',
//     name: 'Amanda Scott',
//     email: 'amanda.scott@example.com',
//     status: 'Suspended',
//     role: 'User',
//     lastActive: '1 month ago',
//     phone: '+1 (555) 123-4567',
//     address: '131 Oak St, Kansas City, MO 64105',
//     joinDate: 'Nov 25, 2023',
//     bio: 'Graphic designer specializing in brand identity and visual communication.',
//   },
//   {
//     id: '23',
//     name: 'Kevin Rodriguez',
//     email: 'kevin.rodriguez@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '3 hours ago',
//     phone: '+1 (555) 234-5678',
//     address: '120 Maple St, Tucson, AZ 85701',
//     joinDate: 'Dec 10, 2023',
//     bio: 'Software engineer with expertise in backend development and database design.',
//   },
//   {
//     id: '24',
//     name: 'Laura Martinez',
//     email: 'laura.martinez@example.com',
//     status: 'Active',
//     role: 'Manager',
//     lastActive: '5 hours ago',
//     phone: '+1 (555) 345-6789',
//     address: '109 Cedar St, Fresno, CA 93721',
//     joinDate: 'Jan 5, 2024',
//     bio: 'HR manager with experience in employee development and organizational culture.',
//   },
//   {
//     id: '25',
//     name: 'Steven Lewis',
//     email: 'steven.lewis@example.com',
//     status: 'Inactive',
//     role: 'User',
//     lastActive: '2 weeks ago',
//     phone: '+1 (555) 456-7890',
//     address: '98 Elm St, Sacramento, CA 95814',
//     joinDate: 'Feb 15, 2024',
//     bio: 'Financial advisor specializing in investment strategies and retirement planning.',
//   },
//   {
//     id: '26',
//     name: 'Michelle Clark',
//     email: 'michelle.clark@example.com',
//     status: 'Active',
//     role: 'Admin',
//     lastActive: '1 day ago',
//     phone: '+1 (555) 567-8901',
//     address: '87 Birch St, Long Beach, CA 90802',
//     joinDate: 'Mar 8, 2024',
//     bio: 'Systems administrator with expertise in cloud infrastructure and network security.',
//   },
//   {
//     id: '27',
//     name: 'Edward Walker',
//     email: 'edward.walker@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '7 hours ago',
//     phone: '+1 (555) 678-9012',
//     address: '76 Pine St, Oakland, CA 94607',
//     joinDate: 'Mar 20, 2024',
//     bio: 'Digital marketer specializing in SEO and content strategy.',
//   },
//   {
//     id: '28',
//     name: 'Nancy Hall',
//     email: 'nancy.hall@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '8 hours ago',
//     phone: '+1 (555) 789-0123',
//     address: '65 Oak St, Minneapolis, MN 55401',
//     joinDate: 'Mar 25, 2024',
//     bio: 'Project coordinator with experience in event planning and team management.',
//   },
//   {
//     id: '29',
//     name: 'George Allen',
//     email: 'george.allen@example.com',
//     status: 'Active',
//     role: 'Manager',
//     lastActive: '9 hours ago',
//     phone: '+1 (555) 890-1234',
//     address: '54 Maple St, Tulsa, OK 74103',
//     joinDate: 'Mar 28, 2024',
//     bio: 'Operations director with expertise in process optimization and strategic planning.',
//   },
//   {
//     id: '30',
//     name: 'Carol Young',
//     email: 'carol.young@example.com',
//     status: 'Active',
//     role: 'User',
//     lastActive: '10 hours ago',
//     phone: '+1 (555) 901-2345',
//     address: '43 Cedar St, Cleveland, OH 44113',
//     joinDate: 'Mar 30, 2024',
//     bio: 'Customer experience specialist focusing on service excellence and client retention.',
//   },
// ]

const sampleContracts: Contract[] = [
  {
    id: 'CTR-7890',
    userId: '1',
    title: 'Enterprise Software Development',
    value: 125000,
    startDate: 'Jan 15, 2023',
    endDate: 'Jan 14, 2024',
    status: 'Active',
    description:
      'Development of custom enterprise resource planning software with integrated modules for inventory management, human resources, and financial reporting.',
    client: 'Acme Corporation',
    contactPerson: 'John Smith',
    contactEmail: 'john.smith@acme.com',
    contactPhone: '+1 (555) 123-4567',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7891',
    userId: '1',
    title: 'Mobile App Development',
    value: 85000,
    startDate: 'Feb 1, 2023',
    endDate: 'Jan 31, 2024',
    status: 'Active',
    description:
      'Design and development of cross-platform mobile applications for iOS and Android.',
    client: 'TechStart Inc.',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.j@techstart.com',
    contactPhone: '+1 (555) 987-6543',
    terms: 'Net 15',
    renewalOption: true,
  },
  {
    id: 'CTR-7892',
    userId: '1',
    title: 'Cloud Migration Services',
    value: 65000,
    startDate: 'Mar 10, 2023',
    endDate: 'Mar 9, 2024',
    status: 'Pending',
    description: 'Migration of on-premises infrastructure to cloud-based solutions.',
    client: 'Global Enterprises',
    contactPerson: 'Michael Brown',
    contactEmail: 'm.brown@globalent.com',
    contactPhone: '+1 (555) 456-7890',
    terms: 'Net 45',
    renewalOption: false,
  },
  {
    id: 'CTR-7893',
    userId: '2',
    title: 'Digital Marketing Campaign',
    value: 45000,
    startDate: 'Apr 5, 2023',
    endDate: 'Apr 4, 2024',
    status: 'Active',
    description: 'Comprehensive digital marketing campaign including SEO optimization.',
    client: 'Retail Solutions',
    contactPerson: 'Emily Davis',
    contactEmail: 'emily@retailsolutions.com',
    contactPhone: '+1 (555) 234-5678',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7894',
    userId: '3',
    title: 'Website Redesign',
    value: 35000,
    startDate: 'May 15, 2023',
    endDate: 'Nov 14, 2023',
    status: 'Expired',
    description: 'Complete redesign of corporate website with responsive design and improved UX.',
    client: 'Fashion Forward',
    contactPerson: 'Alex Wilson',
    contactEmail: 'alex@fashionforward.com',
    contactPhone: '+1 (555) 345-6789',
    terms: 'Net 15',
    renewalOption: false,
  },
  {
    id: 'CTR-7895',
    userId: '4',
    title: 'E-commerce Platform Development',
    value: 95000,
    startDate: 'Jun 1, 2023',
    endDate: 'May 31, 2024',
    status: 'Active',
    description:
      'Development of a custom e-commerce platform with inventory management and payment processing.',
    client: 'Luxury Goods Inc.',
    contactPerson: 'Patricia Lee',
    contactEmail: 'patricia@luxurygoods.com',
    contactPhone: '+1 (555) 456-7890',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7896',
    userId: '5',
    title: 'IT Infrastructure Upgrade',
    value: 75000,
    startDate: 'Jul 10, 2023',
    endDate: 'Jan 9, 2024',
    status: 'Expired',
    description:
      'Comprehensive upgrade of IT infrastructure including servers, networking, and security systems.',
    client: 'Financial Services Co.',
    contactPerson: 'Robert Chen',
    contactEmail: 'robert@financialservices.com',
    contactPhone: '+1 (555) 567-8901',
    terms: 'Net 45',
    renewalOption: false,
  },
  {
    id: 'CTR-7897',
    userId: '6',
    title: 'Content Management System',
    value: 55000,
    startDate: 'Aug 15, 2023',
    endDate: 'Aug 14, 2024',
    status: 'Active',
    description: 'Implementation of a custom content management system with workflow automation.',
    client: 'Media Group',
    contactPerson: 'Jennifer Adams',
    contactEmail: 'jennifer@mediagroup.com',
    contactPhone: '+1 (555) 678-9012',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7898',
    userId: '7',
    title: 'Data Analytics Platform',
    value: 115000,
    startDate: 'Sep 1, 2023',
    endDate: 'Aug 31, 2024',
    status: 'Active',
    description:
      'Development of a data analytics platform with visualization tools and reporting capabilities.',
    client: 'Research Institute',
    contactPerson: 'David Miller',
    contactEmail: 'david@researchinstitute.com',
    contactPhone: '+1 (555) 789-0123',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7899',
    userId: '8',
    title: 'Mobile App Maintenance',
    value: 25000,
    startDate: 'Oct 10, 2023',
    endDate: 'Oct 9, 2024',
    status: 'Active',
    description: 'Ongoing maintenance and support for existing mobile applications.',
    client: 'Travel Services',
    contactPerson: 'Susan Walker',
    contactEmail: 'susan@travelservices.com',
    contactPhone: '+1 (555) 890-1234',
    terms: 'Net 15',
    renewalOption: true,
  },
  {
    id: 'CTR-7900',
    userId: '9',
    title: 'Cybersecurity Assessment',
    value: 40000,
    startDate: 'Nov 15, 2023',
    endDate: 'Feb 14, 2024',
    status: 'Pending',
    description:
      'Comprehensive assessment of cybersecurity posture with recommendations for improvements.',
    client: 'Healthcare Provider',
    contactPerson: 'Michael Johnson',
    contactEmail: 'michael@healthcareprovider.com',
    contactPhone: '+1 (555) 901-2345',
    terms: 'Net 30',
    renewalOption: false,
  },
  {
    id: 'CTR-7901',
    userId: '10',
    title: 'AI Chatbot Development',
    value: 65000,
    startDate: 'Dec 1, 2023',
    endDate: 'Nov 30, 2024',
    status: 'Active',
    description: 'Development of an AI-powered chatbot for customer service automation.',
    client: 'Retail Chain',
    contactPerson: 'Lisa Taylor',
    contactEmail: 'lisa@retailchain.com',
    contactPhone: '+1 (555) 012-3456',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7902',
    userId: '11',
    title: 'Business Intelligence Solution',
    value: 85000,
    startDate: 'Jan 10, 2024',
    endDate: 'Jan 9, 2025',
    status: 'Active',
    description:
      'Implementation of a business intelligence solution with custom dashboards and reporting.',
    client: 'Manufacturing Inc.',
    contactPerson: 'James Wilson',
    contactEmail: 'james@manufacturing.com',
    contactPhone: '+1 (555) 123-4567',
    terms: 'Net 45',
    renewalOption: true,
  },
  {
    id: 'CTR-7903',
    userId: '12',
    title: 'CRM Implementation',
    value: 70000,
    startDate: 'Feb 15, 2024',
    endDate: 'Feb 14, 2025',
    status: 'Active',
    description:
      'Implementation of a customer relationship management system with sales automation.',
    client: 'Sales Organization',
    contactPerson: 'Thomas Brown',
    contactEmail: 'thomas@salesorg.com',
    contactPhone: '+1 (555) 234-5678',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7904',
    userId: '13',
    title: 'DevOps Automation',
    value: 55000,
    startDate: 'Mar 1, 2024',
    endDate: 'Feb 28, 2025',
    status: 'Pending',
    description: 'Implementation of DevOps automation for continuous integration and deployment.',
    client: 'Software Company',
    contactPerson: 'Patricia Martin',
    contactEmail: 'patricia@softwarecompany.com',
    contactPhone: '+1 (555) 345-6789',
    terms: 'Net 30',
    renewalOption: false,
  },
  {
    id: 'CTR-7905',
    userId: '14',
    title: 'Virtual Reality Training',
    value: 95000,
    startDate: 'Mar 15, 2024',
    endDate: 'Mar 14, 2025',
    status: 'Active',
    description:
      'Development of virtual reality training modules for employee onboarding and skills development.',
    client: 'Education Technologies',
    contactPerson: 'Barbara White',
    contactEmail: 'barbara@edtech.com',
    contactPhone: '+1 (555) 456-7890',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7906',
    userId: '15',
    title: 'Blockchain Integration',
    value: 110000,
    startDate: 'Apr 1, 2024',
    endDate: 'Mar 31, 2025',
    status: 'Pending',
    description: 'Integration of blockchain technology for secure transactions and record-keeping.',
    client: 'Financial Institution',
    contactPerson: 'Charles Lee',
    contactEmail: 'charles@financialinst.com',
    contactPhone: '+1 (555) 567-8901',
    terms: 'Net 45',
    renewalOption: false,
  },
  {
    id: 'CTR-7907',
    userId: '16',
    title: 'IoT Platform Development',
    value: 125000,
    startDate: 'Apr 15, 2024',
    endDate: 'Apr 14, 2025',
    status: 'Active',
    description:
      'Development of an Internet of Things platform for device management and data collection.',
    client: 'Smart Solutions',
    contactPerson: 'Susan Walker',
    contactEmail: 'susan@smartsolutions.com',
    contactPhone: '+1 (555) 678-9012',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    id: 'CTR-7908',
    userId: '17',
    title: 'ERP System Upgrade',
    value: 135000,
    startDate: 'May 1, 2024',
    endDate: 'Apr 30, 2025',
    status: 'Active',
    description:
      'Upgrade of existing enterprise resource planning system with new modules and features.',
    client: 'Manufacturing Corp',
    contactPerson: 'Joseph Hall',
    contactEmail: 'joseph@manufacturingcorp.com',
    contactPhone: '+1 (555) 789-0123',
    terms: 'Net 45',
    renewalOption: true,
  },
  {
    id: 'CTR-7909',
    userId: '18',
    title: 'Data Migration Services',
    value: 45000,
    startDate: 'May 15, 2024',
    endDate: 'Aug 14, 2024',
    status: 'Active',
    description:
      'Migration of data from legacy systems to new platforms with data cleansing and validation.',
    client: 'Insurance Company',
    contactPerson: 'Jessica Allen',
    contactEmail: 'jessica@insuranceco.com',
    contactPhone: '+1 (555) 890-1234',
    terms: 'Net 30',
    renewalOption: false,
  },
  {
    id: 'CTR-7910',
    userId: '19',
    title: 'Custom API Development',
    value: 55000,
    startDate: 'Jun 1, 2024',
    endDate: 'May 31, 2025',
    status: 'Pending',
    description: 'Development of custom APIs for system integration and data exchange.',
    client: 'Tech Integrators',
    contactPerson: 'Christopher Young',
    contactEmail: 'christopher@techintegrators.com',
    contactPhone: '+1 (555) 901-2345',
    terms: 'Net 15',
    renewalOption: true,
  },
]

const sampleTransactions: Transaction[] = [
  {
    id: 'TRX-001',
    contractId: 'CTR-7890',
    date: 'Jan 15, 2023',
    amount: 37500,
    type: 'investment',
    description: 'Initial payment (30%)',
    userId: 1,
  },
  {
    id: 'TRX-002',
    contractId: 'CTR-7890',
    date: 'Apr 22, 2023',
    amount: 37500,
    type: 'investment',
    description: 'Milestone payment (30%)',
    userId: 1,
  },
  {
    id: 'TRX-003',
    contractId: 'CTR-7890',
    date: 'May 15, 2023',
    amount: 5000,
    type: 'withdraw',
    description: 'Resource allocation',
    userId: 1,
  },
  {
    id: 'TRX-004',
    contractId: 'CTR-7890',
    date: 'Jun 30, 2023',
    amount: 7500,
    type: 'bonus',
    description: 'Early delivery bonus',
    userId: 1,
  },
  {
    id: 'TRX-005',
    contractId: 'CTR-7890',
    date: 'Jul 15, 2023',
    amount: 12000,
    type: 'withdraw',
    description: 'Development costs',
    userId: 1,
  },
  {
    id: 'TRX-006',
    contractId: 'CTR-7890',
    date: 'Aug 22, 2023',
    amount: 8000,
    type: 'withdraw',
    description: 'Testing resources',
    userId: 1,
  },
  {
    id: 'TRX-007',
    contractId: 'CTR-7890',
    date: 'Oct 10, 2023',
    amount: 50000,
    type: 'investment',
    description: 'Final payment (40%)',
    userId: 1,
  },
  {
    id: 'TRX-008',
    contractId: 'CTR-7891',
    date: 'Feb 1, 2023',
    amount: 25500,
    type: 'investment',
    description: 'Initial payment (30%)',
    userId: 1,
  },
  {
    id: 'TRX-009',
    contractId: 'CTR-7891',
    date: 'May 15, 2023',
    amount: 25500,
    type: 'investment',
    description: 'Milestone payment (30%)',
    userId: 2,
  },
  {
    id: 'TRX-010',
    contractId: 'CTR-7891',
    date: 'Jun 10, 2023',
    amount: 4500,
    type: 'withdraw',
    description: 'UI/UX design costs',
    userId: 1,
  },
  {
    id: 'TRX-011',
    contractId: 'CTR-7891',
    date: 'Jul 22, 2023',
    amount: 6000,
    type: 'withdraw',
    description: 'Development resources',
    userId: 2,
  },
  {
    id: 'TRX-012',
    contractId: 'CTR-7891',
    date: 'Sep 5, 2023',
    amount: 5000,
    type: 'bonus',
    description: 'Performance optimization bonus',
    userId: 2,
  },
  {
    id: 'TRX-013',
    contractId: 'CTR-7892',
    date: 'Mar 10, 2023',
    amount: 19500,
    type: 'investment',
    description: 'Initial payment (30%)',
    userId: 1,
  },
  {
    id: 'TRX-014',
    contractId: 'CTR-7893',
    date: 'Apr 5, 2023',
    amount: 13500,
    type: 'investment',
    description: 'Initial payment (30%)',
    userId: 1,
  },
  {
    id: 'TRX-015',
    contractId: 'CTR-7890',
    date: 'Nov 15, 2023',
    amount: 4500,
    type: 'withdraw',
    description: 'Support and maintenance',
    userId: 1,
  },
  {
    id: 'TRX-016',
    contractId: 'CTR-7890',
    date: 'Dec 20, 2023',
    amount: 6000,
    type: 'bonus',
    description: 'Year-end performance bonus',
    userId: 1,
  },
  {
    id: 'TRX-017',
    contractId: 'CTR-7894',
    date: 'May 15, 2023',
    amount: 10500,
    type: 'investment',
    description: 'Initial payment (30%)',
    userId: 1,
  },
  {
    id: 'TRX-018',
    contractId: 'CTR-7894',
    date: 'Jul 20, 2023',
    amount: 10500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-019',
    contractId: 'CTR-7894',
    date: 'Oct 10, 2023',
    amount: 14000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-020',
    contractId: 'CTR-7895',
    date: 'Jun 1, 2023',
    amount: 28500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-021',
    contractId: 'CTR-7895',
    date: 'Sep 15, 2023',
    amount: 28500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-022',
    contractId: 'CTR-7895',
    date: 'Dec 5, 2023',
    amount: 38000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-023',
    contractId: 'CTR-7896',
    date: 'Jul 10, 2023',
    amount: 22500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-024',
    contractId: 'CTR-7896',
    date: 'Oct 15, 2023',
    amount: 22500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-025',
    contractId: 'CTR-7896',
    date: 'Jan 5, 2024',
    amount: 30000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-026',
    contractId: 'CTR-7897',
    date: 'Aug 15, 2023',
    amount: 16500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-027',
    contractId: 'CTR-7897',
    date: 'Nov 20, 2023',
    amount: 16500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-028',
    contractId: 'CTR-7897',
    date: 'Feb 10, 2024',
    amount: 22000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-029',
    contractId: 'CTR-7898',
    date: 'Sep 1, 2023',
    amount: 34500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-030',
    contractId: 'CTR-7898',
    date: 'Dec 15, 2023',
    amount: 34500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-031',
    contractId: 'CTR-7898',
    date: 'Mar 5, 2024',
    amount: 46000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-032',
    contractId: 'CTR-7899',
    date: 'Oct 10, 2023',
    amount: 7500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-033',
    contractId: 'CTR-7899',
    date: 'Jan 15, 2024',
    amount: 7500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-034',
    contractId: 'CTR-7899',
    date: 'Apr 5, 2024',
    amount: 10000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-035',
    contractId: 'CTR-7901',
    date: 'Dec 1, 2023',
    amount: 19500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-036',
    contractId: 'CTR-7901',
    date: 'Mar 10, 2024',
    amount: 19500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-037',
    contractId: 'CTR-7902',
    date: 'Jan 10, 2024',
    amount: 25500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-038',
    contractId: 'CTR-7903',
    date: 'Feb 15, 2024',
    amount: 21000,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-039',
    contractId: 'CTR-7905',
    date: 'Mar 15, 2024',
    amount: 28500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-040',
    contractId: 'CTR-7907',
    date: 'Apr 15, 2024',
    amount: 37500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-041',
    contractId: 'CTR-7908',
    date: 'May 1, 2024',
    amount: 40500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-042',
    contractId: 'CTR-7909',
    date: 'May 15, 2024',
    amount: 13500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
]

const userFinancialData = [
  {
    userId: '1',
    totalInvestment: 125000,
    totalWithdraw: 45000,
    totalEarnings: 32500,
    investmentChange: 12.5,
    withdrawChange: -5.2,
    earningsChange: 8.7,
  },
  {
    userId: '2',
    totalInvestment: 87500,
    totalWithdraw: 23000,
    totalEarnings: 18200,
    investmentChange: 5.8,
    withdrawChange: 3.2,
    earningsChange: 10.5,
  },
  {
    userId: '3',
    totalInvestment: 65000,
    totalWithdraw: 15000,
    totalEarnings: 12500,
    investmentChange: 4.2,
    withdrawChange: 2.1,
    earningsChange: 7.8,
  },
  {
    userId: '4',
    totalInvestment: 95000,
    totalWithdraw: 28000,
    totalEarnings: 22000,
    investmentChange: 6.5,
    withdrawChange: -1.8,
    earningsChange: 9.2,
  },
  {
    userId: '5',
    totalInvestment: 75000,
    totalWithdraw: 18000,
    totalEarnings: 15500,
    investmentChange: 3.7,
    withdrawChange: 1.5,
    earningsChange: 6.3,
  },
  {
    userId: '6',
    totalInvestment: 55000,
    totalWithdraw: 12000,
    totalEarnings: 10800,
    investmentChange: 2.9,
    withdrawChange: 0.8,
    earningsChange: 5.1,
  },
  {
    userId: '7',
    totalInvestment: 115000,
    totalWithdraw: 35000,
    totalEarnings: 28000,
    investmentChange: 7.8,
    withdrawChange: -2.5,
    earningsChange: 11.2,
  },
  {
    userId: '8',
    totalInvestment: 25000,
    totalWithdraw: 5000,
    totalEarnings: 4800,
    investmentChange: 1.5,
    withdrawChange: 0.3,
    earningsChange: 2.7,
  },
  {
    userId: '9',
    totalInvestment: 40000,
    totalWithdraw: 8000,
    totalEarnings: 7500,
    investmentChange: 2.2,
    withdrawChange: 0.6,
    earningsChange: 3.9,
  },
  {
    userId: '10',
    totalInvestment: 65000,
    totalWithdraw: 15000,
    totalEarnings: 12800,
    investmentChange: 3.5,
    withdrawChange: 1.2,
    earningsChange: 6.8,
  },
]

const userEquityData = [
  {
    userId: '1',
    data: [
      { month: 'Apr', equity: 67000, investments: 45000 },
      { month: 'May', equity: 75800, investments: 48000 },
      { month: 'Jun', equity: 93400, investments: 52000 },
      { month: 'Jul', equity: 102500, investments: 55000 },
      { month: 'Aug', equity: 108700, investments: 58000 },
      { month: 'Sep', equity: 120000, investments: 62000 },
      { month: 'Oct', equity: 135800, investments: 68000 },
      { month: 'Nov', equity: 147200, investments: 72000 },
      { month: 'Dec', equity: 160500, investments: 76000 },
      { month: 'Jan', equity: 169300, investments: 80000 },
      { month: 'Feb', equity: 180100, investments: 85000 },
      { month: 'Mar', equity: 192800, investments: 90000 },
    ],
  },
  {
    userId: '2',
    data: [
      { month: 'Apr', equity: 42000, investments: 30000 },
      { month: 'May', equity: 48500, investments: 32000 },
      { month: 'Jun', equity: 55200, investments: 35000 },
      { month: 'Jul', equity: 63800, investments: 38000 },
      { month: 'Aug', equity: 72100, investments: 42000 },
      { month: 'Sep', equity: 79500, investments: 45000 },
      { month: 'Oct', equity: 88200, investments: 48000 },
      { month: 'Nov', equity: 95700, investments: 50000 },
      { month: 'Dec', equity: 104300, investments: 53000 },
      { month: 'Jan', equity: 112800, investments: 56000 },
      { month: 'Feb', equity: 121500, investments: 59000 },
      { month: 'Mar', equity: 130200, investments: 62000 },
    ],
  },
  {
    userId: '3',
    data: [
      { month: 'Apr', equity: 32000, investments: 25000 },
      { month: 'May', equity: 35800, investments: 27000 },
      { month: 'Jun', equity: 39500, investments: 29000 },
      { month: 'Jul', equity: 43200, investments: 31000 },
      { month: 'Aug', equity: 47800, investments: 33000 },
      { month: 'Sep', equity: 52500, investments: 35000 },
      { month: 'Oct', equity: 57200, investments: 37000 },
      { month: 'Nov', equity: 62800, investments: 39000 },
      { month: 'Dec', equity: 68500, investments: 41000 },
      { month: 'Jan', equity: 74200, investments: 43000 },
      { month: 'Feb', equity: 79800, investments: 45000 },
      { month: 'Mar', equity: 85500, investments: 47000 },
    ],
  },
  {
    userId: '4',
    data: [
      { month: 'Apr', equity: 48000, investments: 35000 },
      { month: 'May', equity: 53500, investments: 38000 },
      { month: 'Jun', equity: 59000, investments: 41000 },
      { month: 'Jul', equity: 64500, investments: 44000 },
      { month: 'Aug', equity: 70000, investments: 47000 },
      { month: 'Sep', equity: 75500, investments: 50000 },
      { month: 'Oct', equity: 81000, investments: 53000 },
      { month: 'Nov', equity: 86500, investments: 56000 },
      { month: 'Dec', equity: 92000, investments: 59000 },
      { month: 'Jan', equity: 97500, investments: 62000 },
      { month: 'Feb', equity: 103000, investments: 65000 },
      { month: 'Mar', equity: 108500, investments: 68000 },
    ],
  },
  {
    userId: '5',
    data: [
      { month: 'Apr', equity: 38000, investments: 28000 },
      { month: 'May', equity: 42500, investments: 30000 },
      { month: 'Jun', equity: 47000, investments: 32000 },
      { month: 'Jul', equity: 51500, investments: 34000 },
      { month: 'Aug', equity: 56000, investments: 36000 },
      { month: 'Sep', equity: 60500, investments: 38000 },
      { month: 'Oct', equity: 65000, investments: 40000 },
      { month: 'Nov', equity: 69500, investments: 42000 },
      { month: 'Dec', equity: 74000, investments: 44000 },
      { month: 'Jan', equity: 78500, investments: 46000 },
      { month: 'Feb', equity: 83000, investments: 48000 },
      { month: 'Mar', equity: 87500, investments: 50000 },
    ],
  },
]

const contractEquityData = [
  {
    contractId: 'CTR-7890',
    data: [
      { month: 'Jan', value: 37500, cost: 5000, profit: 32500 },
      { month: 'Feb', value: 37500, cost: 8000, profit: 29500 },
      { month: 'Mar', value: 37500, cost: 12000, profit: 25500 },
      { month: 'Apr', value: 75000, cost: 15000, profit: 60000 },
      { month: 'May', value: 75000, cost: 20000, profit: 55000 },
      { month: 'Jun', value: 75000, cost: 22500, profit: 52500 },
      { month: 'Jul', value: 75000, cost: 34500, profit: 40500 },
      { month: 'Aug', value: 75000, cost: 42500, profit: 32500 },
      { month: 'Sep', value: 75000, cost: 45000, profit: 30000 },
      { month: 'Oct', value: 125000, cost: 48000, profit: 77000 },
      { month: 'Nov', value: 125000, cost: 50000, profit: 75000 },
      { month: 'Dec', value: 125000, cost: 52000, profit: 73000 },
    ],
  },
  {
    contractId: 'CTR-7891',
    data: [
      { month: 'Feb', value: 25500, cost: 3000, profit: 22500 },
      { month: 'Mar', value: 25500, cost: 5000, profit: 20500 },
      { month: 'Apr', value: 25500, cost: 7500, profit: 18000 },
      { month: 'May', value: 51000, cost: 12000, profit: 39000 },
      { month: 'Jun', value: 51000, cost: 16500, profit: 34500 },
      { month: 'Jul', value: 51000, cost: 22500, profit: 28500 },
      { month: 'Aug', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Sep', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Oct', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Nov', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Dec', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Jan', value: 51000, cost: 25000, profit: 26000 },
    ],
  },
  {
    contractId: 'CTR-7892',
    data: [
      { month: 'Mar', value: 19500, cost: 2000, profit: 17500 },
      { month: 'Apr', value: 19500, cost: 4000, profit: 15500 },
      { month: 'May', value: 19500, cost: 6000, profit: 13500 },
      { month: 'Jun', value: 19500, cost: 8000, profit: 11500 },
      { month: 'Jul', value: 19500, cost: 10000, profit: 9500 },
      { month: 'Aug', value: 19500, cost: 12000, profit: 7500 },
      { month: 'Sep', value: 19500, cost: 14000, profit: 5500 },
      { month: 'Oct', value: 19500, cost: 16000, profit: 3500 },
      { month: 'Nov', value: 19500, cost: 18000, profit: 1500 },
      { month: 'Dec', value: 19500, cost: 19000, profit: 500 },
      { month: 'Jan', value: 19500, cost: 19000, profit: 500 },
      { month: 'Feb', value: 19500, cost: 19000, profit: 500 },
    ],
  },
  {
    contractId: 'CTR-7893',
    data: [
      { month: 'Apr', value: 13500, cost: 1500, profit: 12000 },
      { month: 'May', value: 13500, cost: 3000, profit: 10500 },
      { month: 'Jun', value: 13500, cost: 4500, profit: 9000 },
      { month: 'Jul', value: 13500, cost: 6000, profit: 7500 },
      { month: 'Aug', value: 13500, cost: 7500, profit: 6000 },
      { month: 'Sep', value: 13500, cost: 9000, profit: 4500 },
      { month: 'Oct', value: 13500, cost: 10500, profit: 3000 },
      { month: 'Nov', value: 13500, cost: 12000, profit: 1500 },
      { month: 'Dec', value: 13500, cost: 13000, profit: 500 },
      { month: 'Jan', value: 13500, cost: 13000, profit: 500 },
      { month: 'Feb', value: 13500, cost: 13000, profit: 500 },
      { month: 'Mar', value: 13500, cost: 13000, profit: 500 },
    ],
  },
  {
    contractId: 'CTR-7894',
    data: [
      { month: 'May', value: 10500, cost: 1200, profit: 9300 },
      { month: 'Jun', value: 10500, cost: 2400, profit: 8100 },
      { month: 'Jul', value: 10500, cost: 3600, profit: 6900 },
      { month: 'Aug', value: 21000, cost: 4800, profit: 16200 },
      { month: 'Sep', value: 21000, cost: 6000, profit: 15000 },
      { month: 'Oct', value: 35000, cost: 7200, profit: 27800 },
      { month: 'Nov', value: 35000, cost: 8400, profit: 26600 },
    ],
  },
  {
    contractId: 'CTR-7895',
    data: [
      { month: 'Jun', value: 28500, cost: 3000, profit: 25500 },
      { month: 'Jul', value: 28500, cost: 6000, profit: 22500 },
      { month: 'Aug', value: 28500, cost: 9000, profit: 19500 },
      { month: 'Sep', value: 57000, cost: 12000, profit: 45000 },
      { month: 'Oct', value: 57000, cost: 15000, profit: 42000 },
      { month: 'Nov', value: 57000, cost: 18000, profit: 39000 },
      { month: 'Dec', value: 95000, cost: 21000, profit: 74000 },
      { month: 'Jan', value: 95000, cost: 24000, profit: 71000 },
      { month: 'Feb', value: 95000, cost: 27000, profit: 68000 },
      { month: 'Mar', value: 95000, cost: 30000, profit: 65000 },
      { month: 'Apr', value: 95000, cost: 33000, profit: 62000 },
      { month: 'May', value: 95000, cost: 36000, profit: 59000 },
    ],
  },
]
