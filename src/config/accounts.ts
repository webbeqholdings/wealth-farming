export const accountConfig = {
  tabList: [
    { label: 'Deposit', value: 'deposit', href: '/account/deposit' },
    { label: 'Transfer', value: 'transfer', href: '/account/transfer' },
    { label: 'Withdrawal', value: 'withdrawal', href: '/account/withdrawal' },
    { label: 'History', value: 'history', href: '/account/history/deposit' },
  ],
}

export type AccountConfig = typeof accountConfig
