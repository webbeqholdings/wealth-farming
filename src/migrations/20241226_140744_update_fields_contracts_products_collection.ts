import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_investment_products_term" AS ENUM('monthly', 'quarterly', 'semester', 'annually');
  ALTER TABLE "investment_products" DROP CONSTRAINT "investment_products_fund_id_investment_funds_id_fk";
  
  DROP INDEX IF EXISTS "investment_products_fund_idx";
  ALTER TABLE "investment_products" ALTER COLUMN "min_investment" DROP NOT NULL;
  ALTER TABLE "contracts" ADD COLUMN "profit" numeric;
  ALTER TABLE "contracts" ADD COLUMN "expected_return" numeric;
  ALTER TABLE "contracts" ADD COLUMN "term" varchar;
  ALTER TABLE "contracts" ADD COLUMN "periods" numeric;
  ALTER TABLE "investment_products" ADD COLUMN "term" "enum_investment_products_term";
  ALTER TABLE "investment_products" ADD COLUMN "rate_of_return" numeric;
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "fund_id";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "product_overview";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "max_investment";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "start_date";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "end_date";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "interest_rate_month";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "interest_rate_from";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "interest_rate_to";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "profit_period";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "status";
  DROP TYPE "public"."enum_investment_products_profit_period";
  DROP TYPE "public"."enum_investment_products_status";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_investment_products_profit_period" AS ENUM('monthly', 'quarterly', 'semi_annually', 'annually');
  CREATE TYPE "public"."enum_investment_products_status" AS ENUM('available', 'unavailable');
  ALTER TABLE "investment_products" ALTER COLUMN "min_investment" SET NOT NULL;
  ALTER TABLE "investment_products" ADD COLUMN "fund_id" integer NOT NULL;
  ALTER TABLE "investment_products" ADD COLUMN "product_overview" jsonb;
  ALTER TABLE "investment_products" ADD COLUMN "max_investment" numeric;
  ALTER TABLE "investment_products" ADD COLUMN "start_date" timestamp(3) with time zone;
  ALTER TABLE "investment_products" ADD COLUMN "end_date" timestamp(3) with time zone;
  ALTER TABLE "investment_products" ADD COLUMN "interest_rate_month" numeric;
  ALTER TABLE "investment_products" ADD COLUMN "interest_rate_from" numeric;
  ALTER TABLE "investment_products" ADD COLUMN "interest_rate_to" numeric;
  ALTER TABLE "investment_products" ADD COLUMN "profit_period" "enum_investment_products_profit_period" NOT NULL;
  ALTER TABLE "investment_products" ADD COLUMN "status" "enum_investment_products_status" NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "investment_products" ADD CONSTRAINT "investment_products_fund_id_investment_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."investment_funds"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "investment_products_fund_idx" ON "investment_products" USING btree ("fund_id");
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "profit";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "expected_return";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "term";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "periods";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "term";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "rate_of_return";
  DROP TYPE "public"."enum_investment_products_term";`)
}
