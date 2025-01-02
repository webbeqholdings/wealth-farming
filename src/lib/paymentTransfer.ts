export const getPaymentTransfer = async () => {
    try {
        const response = await fetch('/api/globals/gc-payment-transfer?depth=1&draft=false&locale=undefined');
        const data = await response.json();

        return {
            id: data.id || null, // Assuming id is not available in the current response
            bankQrCode: data.bank_qr_code,
            bankAccountNumber: data.bank_account_number,
            bankAccountDescription: data.bank_account_description,
            cryptoWalletQrCode: data.crypto_wallet_qr_code,
            cryptoWalletAddress: data.crypto_wallet_address,
            cryptoWalletNetwork: data.crypto_wallet_network,
            minDeposit: data.min_deposit,
            minWithdrawal: data.min_withdrawal,
            minTransfer: data.min_Transfer,
            usdToVnd: Number(data.usd_to_vnd),
            usdtToVnd: data.usdt_to_vnd,
            usdToUsdt: data.usd_to_usdt,
        };
    } catch (error) {
        console.error('Transaction error:', error);
        throw new Error('Error.', error);
    }
};