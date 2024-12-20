import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_withdrawals_status" AS ENUM('completed', 'pending', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'updateProfit');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_workflow_slug" AS ENUM();
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'updateProfit');
  CREATE TYPE "public"."enum_payload_jobs_queue" AS ENUM('default');
  CREATE TABLE IF NOT EXISTS "withdrawals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contract_id" integer,
  	"user_id" integer,
  	"amount" numeric NOT NULL,
  	"status" "enum_withdrawals_status" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"workflow_slug" "enum_payload_jobs_workflow_slug",
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" "enum_payload_jobs_queue" DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "contracts" DROP CONSTRAINT "contracts_product_id_id_investment_products_id_fk";
  
  ALTER TABLE "contracts" DROP CONSTRAINT "contracts_account_id_id_accounts_id_fk";
  
  DROP INDEX IF EXISTS "contracts_product_id_idx";
  DROP INDEX IF EXISTS "contracts_account_id_idx";
  ALTER TABLE "contracts" ALTER COLUMN "amount" DROP NOT NULL;
  ALTER TABLE "investment_products" ALTER COLUMN "interest_rate_from" DROP NOT NULL;
  ALTER TABLE "investment_products" ALTER COLUMN "interest_rate_to" DROP NOT NULL;
  ALTER TABLE "user_referrals" ALTER COLUMN "referral_at" DROP NOT NULL;
  ALTER TABLE "contracts" ADD COLUMN "user_id" integer NOT NULL;
  ALTER TABLE "contracts" ADD COLUMN "balance" numeric;
  ALTER TABLE "contracts" ADD COLUMN "expected_return" numeric;
  ALTER TABLE "contracts" ADD COLUMN "start_date" timestamp(3) with time zone;
  ALTER TABLE "contracts" ADD COLUMN "end_date" timestamp(3) with time zone;
  ALTER TABLE "contracts" ADD COLUMN "note_log" jsonb;
  ALTER TABLE "contracts" ADD COLUMN "product_log" jsonb;
  ALTER TABLE "contracts" ADD COLUMN "config_log" jsonb;
  ALTER TABLE "investment_products" ADD COLUMN "interest_rate_month" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "withdrawals_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  DO $$ BEGIN
   ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "withdrawals_contract_idx" ON "withdrawals" USING btree ("contract_id");
  CREATE INDEX IF NOT EXISTS "withdrawals_user_idx" ON "withdrawals" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "withdrawals_updated_at_idx" ON "withdrawals" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "withdrawals_created_at_idx" ON "withdrawals" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX IF NOT EXISTS "payload_jobs_workflow_slug_idx" ON "payload_jobs" USING btree ("workflow_slug");
  CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "contracts" ADD CONSTRAINT "contracts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_withdrawals_fk" FOREIGN KEY ("withdrawals_id") REFERENCES "public"."withdrawals"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "contracts_user_idx" ON "contracts" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_withdrawals_id_idx" ON "payload_locked_documents_rels" USING btree ("withdrawals_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "product_id_id";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "account_id_id";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "withdrawals";
  DROP TABLE "payload_jobs_log";
  DROP TABLE "payload_jobs";
  ALTER TABLE "contracts" DROP CONSTRAINT "contracts_user_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_withdrawals_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX IF EXISTS "contracts_user_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_withdrawals_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "contracts" ALTER COLUMN "amount" SET NOT NULL;
  ALTER TABLE "investment_products" ALTER COLUMN "interest_rate_from" SET NOT NULL;
  ALTER TABLE "investment_products" ALTER COLUMN "interest_rate_to" SET NOT NULL;
  ALTER TABLE "user_referrals" ALTER COLUMN "referral_at" SET NOT NULL;
  ALTER TABLE "contracts" ADD COLUMN "product_id_id" integer NOT NULL;
  ALTER TABLE "contracts" ADD COLUMN "account_id_id" integer NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "contracts" ADD CONSTRAINT "contracts_product_id_id_investment_products_id_fk" FOREIGN KEY ("product_id_id") REFERENCES "public"."investment_products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "contracts" ADD CONSTRAINT "contracts_account_id_id_accounts_id_fk" FOREIGN KEY ("account_id_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "contracts_product_id_idx" ON "contracts" USING btree ("product_id_id");
  CREATE INDEX IF NOT EXISTS "contracts_account_id_idx" ON "contracts" USING btree ("account_id_id");
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "user_id";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "balance";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "expected_return";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "start_date";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "end_date";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "note_log";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "product_log";
  ALTER TABLE "contracts" DROP COLUMN IF EXISTS "config_log";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "interest_rate_month";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "withdrawals_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_jobs_id";
  DROP TYPE "public"."enum_withdrawals_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_workflow_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_jobs_queue";`)
}
