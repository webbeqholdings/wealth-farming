import crypto from 'crypto'

export function generateReferralCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase()
}
export function generateTranferMessageCode(len:number): string {
  return crypto.randomBytes(len).toString('hex').toUpperCase()
}
