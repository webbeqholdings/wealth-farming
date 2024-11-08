import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_users_gender" AS ENUM('male', 'female');
  CREATE TABLE IF NOT EXISTS "banks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"name" varchar,
  	"account_number" varchar,
  	"bank_name" varchar,
  	"branch" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "address" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"street" varchar,
  	"city" varchar,
  	"state" varchar,
  	"zip_code" varchar,
  	"country" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_investment_fund_id_investment_funds_id_fk";
  
  DROP INDEX IF EXISTS "reports_investment_fund_idx";
  ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE numeric;
  ALTER TABLE "users" ADD COLUMN "gender" "enum_users_gender";
  ALTER TABLE "users" ADD COLUMN "birth_date" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "nationality" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "banks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "address_id" integer;
  DO $$ BEGIN
   ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "address" ADD CONSTRAINT "address_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "banks_user_idx" ON "banks" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "banks_updated_at_idx" ON "banks" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "banks_created_at_idx" ON "banks" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "address_user_idx" ON "address" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "address_updated_at_idx" ON "address" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "address_created_at_idx" ON "address" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_banks_fk" FOREIGN KEY ("banks_id") REFERENCES "public"."banks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_address_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_banks_id_idx" ON "payload_locked_documents_rels" USING btree ("banks_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_address_id_idx" ON "payload_locked_documents_rels" USING btree ("address_id");
  ALTER TABLE "reports" DROP COLUMN IF EXISTS "investment_fund_id";
  ALTER TABLE "public"."investment_funds" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_investment_funds_category";
  CREATE TYPE "public"."enum_investment_funds_category" AS ENUM('equity', 'fixed_income', 'real_estate', 'alternative');
  ALTER TABLE "public"."investment_funds" ALTER COLUMN "category" SET DATA TYPE "public"."enum_investment_funds_category" USING "category"::"public"."enum_investment_funds_category";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "banks";
  DROP TABLE "address";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_banks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_address_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_banks_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_address_id_idx";
  ALTER TABLE "reports" ADD COLUMN "investment_fund_id" integer NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_investment_fund_id_investment_funds_id_fk" FOREIGN KEY ("investment_fund_id") REFERENCES "public"."investment_funds"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reports_investment_fund_idx" ON "reports" USING btree ("investment_fund_id");
  ALTER TABLE "users" DROP COLUMN IF EXISTS "gender";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "birth_date";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "nationality";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "banks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "address_id";
  ALTER TABLE "public"."investment_funds" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_investment_funds_category";
  CREATE TYPE "public"."enum_investment_funds_category" AS ENUM('equity', 'fixed-income', 'real-estate', 'alternative');
  ALTER TABLE "public"."investment_funds" ALTER COLUMN "category" SET DATA TYPE "public"."enum_investment_funds_category" USING "category"::"public"."enum_investment_funds_category";
  DROP TYPE "public"."enum_users_gender";`)
}
