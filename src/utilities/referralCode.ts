import crypto from 'crypto'

export function generateReferralCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase()
}
