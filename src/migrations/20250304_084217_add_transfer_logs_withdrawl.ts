import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "transactions" ADD COLUMN "withdrawal_exchange_log_currency_exchange_rate" numeric DEFAULT 1;
  ALTER TABLE "transactions" ADD COLUMN "withdrawal_exchange_log_currency_code" varchar DEFAULT 'vnd';
  ALTER TABLE "gc_payment_transfer" ADD COLUMN "usd_to_vnd_withdrawal" numeric DEFAULT 24444;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "transactions" DROP COLUMN IF EXISTS "withdrawal_exchange_log_currency_exchange_rate";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "withdrawal_exchange_log_currency_code";
  ALTER TABLE "gc_payment_transfer" DROP COLUMN IF EXISTS "usd_to_vnd_withdrawal";`)
}
