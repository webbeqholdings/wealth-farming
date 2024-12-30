import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_gc_payment_transfer_crypto_wallet_network" ADD VALUE 'BEP20';
  ALTER TABLE "gc_payment_transfer" ADD COLUMN "min_deposit" numeric DEFAULT 1000;
  ALTER TABLE "gc_payment_transfer" ADD COLUMN "min_withdrawal" numeric DEFAULT 10;
  ALTER TABLE "gc_payment_transfer" ADD COLUMN "min_transfer" numeric DEFAULT 1;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "gc_payment_transfer" DROP COLUMN IF EXISTS "min_deposit";
  ALTER TABLE "gc_payment_transfer" DROP COLUMN IF EXISTS "min_withdrawal";
  ALTER TABLE "gc_payment_transfer" DROP COLUMN IF EXISTS "min_transfer";
  ALTER TABLE "public"."gc_payment_transfer" ALTER COLUMN "crypto_wallet_network" SET DATA TYPE text;
  DROP TYPE "public"."enum_gc_payment_transfer_crypto_wallet_network";
  CREATE TYPE "public"."enum_gc_payment_transfer_crypto_wallet_network" AS ENUM('TRC20');
  ALTER TABLE "public"."gc_payment_transfer" ALTER COLUMN "crypto_wallet_network" SET DATA TYPE "public"."enum_gc_payment_transfer_crypto_wallet_network" USING "crypto_wallet_network"::"public"."enum_gc_payment_transfer_crypto_wallet_network";`)
}
