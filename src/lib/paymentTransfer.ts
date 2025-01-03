'use server'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({
    config,
})
export const getPaymentTransfer = async () => {
    try {
        const response: any = await payload.findGlobal({
            slug: 'gc-payment-transfer',
            depth: 1,
        })
        return {
            id: response.id || null, // Assuming id is not available in the current response
            bankQrCode: response.bank_qr_code,
            minWithdrawal: response.min_withdrawal,
            bankAccountNumber: response.bank_account_number,
            bankAccountDescription: response.bank_account_description,
            cryptoWalletQrCode: response.crypto_wallet_qr_code,
            cryptoWalletAddress: response.crypto_wallet_address,
            cryptoWalletNetwork: response.crypto_wallet_network,
            minDeposit: response.min_deposit,
            minTransfer: response.min_transfer,
            usdToVnd: Number(response.usd_to_vnd),
            usdtToVnd: response.usdt_to_vnd,
            usdToUsdt: response.usd_to_usdt,
        };
    } catch (error) {
        console.error('Transaction error:', error);
        throw new Error('Error.', error);
    }
};