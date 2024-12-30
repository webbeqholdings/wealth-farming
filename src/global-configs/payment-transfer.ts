import { GlobalConfig } from 'payload'

const GcPaymentTransfer: GlobalConfig = {
  slug: 'gc-payment-transfer',
  label: 'Payment Transfer',
  fields: [
    {
      name: 'bank_qr_code',
      type: 'upload',
      relationTo: 'media',
      label: 'Bank QR Code',
    },
    {
      name: 'bank_account_number',
      type: 'text',
      label: 'Bank Account Number',
    },
    {
      name: 'bank_account_description',
      type: 'text',
      label: 'Bank Account Description',
    },
    {
      name: 'crypto_wallet_qr_code',
      type: 'upload',
      relationTo: 'media',
      label: 'Crypto Wallet QR Code',
    },
    {
      name: 'crypto_wallet_address',
      type: 'text',
      label: 'Crypto Wallet Address',
    },
    {
      name: 'crypto_wallet_network',
      type: 'select',
      options: [
        { label: 'TRC20', value: 'TRC20' },
        { label: 'BNB Smart Chain (BEP20)', value: 'BEP20' },
      ],
      label: 'Crypto Wallet Network',
      defaultValue: 'TRC20',
    },
    {
      name: 'min_deposit',
      type: 'number',
      label: 'Min Deposit',
      defaultValue: 1000,
    },
    {
      name: 'min_withdrawal',
      type: 'number',
      label: 'Min Withdrawal',
      defaultValue: 10,
    },
    {
      name: 'min_transfer',
      type: 'number',
      label: 'Min Transfer',
      defaultValue: 1,
    },
    {
      name: 'usd_to_vnd',
      type: 'number',
      label: 'USD to VND',
      defaultValue: 25455,
    },
    {
      name: 'usdt_to_vnd',
      type: 'number',
      label: 'USDT to VND',
      defaultValue: 25455,
    },
    {
      name: 'usd_to_usdt',
      type: 'number',
      label: 'USDT to USDT',
      defaultValue: 1,
    },
  ],
}

export default GcPaymentTransfer
