import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "investment_profit_loss" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"investment_product_id" integer NOT NULL,
  	"profit_or_loss" numeric NOT NULL,
  	"unit_id" integer NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_name" varchar NOT NULL,
  	"unit_code" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_contract_id_id_contracts_id_fk";
  
  DROP INDEX IF EXISTS "transactions_contract_id_idx";
  ALTER TABLE "accounts" ADD COLUMN "amount" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "transactions" ADD COLUMN "user_id" integer;
  ALTER TABLE "transactions" ADD COLUMN "investment_product_id" integer;
  ALTER TABLE "transactions" ADD COLUMN "profit_or_loss" numeric DEFAULT 0;
  ALTER TABLE "transactions" ADD COLUMN "unit_id" integer;
  ALTER TABLE "transactions" ADD COLUMN "bank_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "investment_profit_loss_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "units_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "qr_codes_id" integer;
  DO $$ BEGIN
   ALTER TABLE "investment_profit_loss" ADD CONSTRAINT "investment_profit_loss_investment_product_id_investment_products_id_fk" FOREIGN KEY ("investment_product_id") REFERENCES "public"."investment_products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "investment_profit_loss" ADD CONSTRAINT "investment_profit_loss_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_investment_product_idx" ON "investment_profit_loss" USING btree ("investment_product_id");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_unit_idx" ON "investment_profit_loss" USING btree ("unit_id");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_updated_at_idx" ON "investment_profit_loss" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_created_at_idx" ON "investment_profit_loss" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "units_unit_code_idx" ON "units" USING btree ("unit_code");
  CREATE INDEX IF NOT EXISTS "units_updated_at_idx" ON "units" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "units_created_at_idx" ON "units" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_investment_product_id_investment_products_id_fk" FOREIGN KEY ("investment_product_id") REFERENCES "public"."investment_products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investment_profit_loss_fk" FOREIGN KEY ("investment_profit_loss_id") REFERENCES "public"."investment_profit_loss"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_units_fk" FOREIGN KEY ("units_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_qr_codes_id_media_id_fk" FOREIGN KEY ("qr_codes_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "transactions_user_idx" ON "transactions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "transactions_investment_product_idx" ON "transactions" USING btree ("investment_product_id");
  CREATE INDEX IF NOT EXISTS "transactions_unit_idx" ON "transactions" USING btree ("unit_id");
  CREATE INDEX IF NOT EXISTS "transactions_bank_idx" ON "transactions" USING btree ("bank_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_profit_loss_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_profit_loss_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_units_id_idx" ON "payload_locked_documents_rels" USING btree ("units_id");
  CREATE INDEX IF NOT EXISTS "site_settings_qr_codes_idx" ON "site_settings" USING btree ("qr_codes_id");
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "contract_id_id";
  ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_transactions_type";
  CREATE TYPE "public"."enum_transactions_type" AS ENUM('deposit', 'withdraw', 'bonus', 'transfer', 'investment');
  ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE "public"."enum_transactions_type" USING "type"::"public"."enum_transactions_type";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "investment_profit_loss";
  DROP TABLE "units";
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_user_id_users_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_investment_product_id_investment_products_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_unit_id_units_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bank_id_banks_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_investment_profit_loss_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_units_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_qr_codes_id_media_id_fk";
  
  DROP INDEX IF EXISTS "transactions_user_idx";
  DROP INDEX IF EXISTS "transactions_investment_product_idx";
  DROP INDEX IF EXISTS "transactions_unit_idx";
  DROP INDEX IF EXISTS "transactions_bank_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_investment_profit_loss_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_units_id_idx";
  DROP INDEX IF EXISTS "site_settings_qr_codes_idx";
  ALTER TABLE "transactions" ADD COLUMN "contract_id_id" integer NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_contract_id_id_contracts_id_fk" FOREIGN KEY ("contract_id_id") REFERENCES "public"."contracts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "transactions_contract_id_idx" ON "transactions" USING btree ("contract_id_id");
  ALTER TABLE "accounts" DROP COLUMN IF EXISTS "amount";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "user_id";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "investment_product_id";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "profit_or_loss";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "unit_id";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "bank_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "investment_profit_loss_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "units_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "qr_codes_id";
  ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_transactions_type";
  CREATE TYPE "public"."enum_transactions_type" AS ENUM('deposit', 'withdraw', 'bonus', 'manage_fee');
  ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE "public"."enum_transactions_type" USING "type"::"public"."enum_transactions_type";`)
}
