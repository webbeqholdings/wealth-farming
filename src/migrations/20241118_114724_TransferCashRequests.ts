import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_transfer_cash_requests_type" AS ENUM('deposit', 'withdrawal', 'bonus');
  CREATE TYPE "public"."enum_transfer_cash_requests_currency" AS ENUM('usd', 'vnd');
  CREATE TYPE "public"."enum_transfer_cash_requests_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_transfer_cash_requests_payment_method" AS ENUM('bank_transfer', 'credit_card', 'paypal', 'crypto');
  CREATE TYPE "public"."enum__transfer_cash_requests_v_version_type" AS ENUM('deposit', 'withdrawal', 'bonus');
  CREATE TYPE "public"."enum__transfer_cash_requests_v_version_currency" AS ENUM('usd', 'vnd');
  CREATE TYPE "public"."enum__transfer_cash_requests_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__transfer_cash_requests_v_version_payment_method" AS ENUM('bank_transfer', 'credit_card', 'paypal', 'crypto');
  CREATE TABLE IF NOT EXISTS "transfer_cash_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_transfer_cash_requests_type",
  	"amount" numeric,
  	"currency" "enum_transfer_cash_requests_currency" DEFAULT 'usd',
  	"status" "enum_transfer_cash_requests_status",
  	"account_id" integer,
  	"payment_method" "enum_transfer_cash_requests_payment_method",
  	"transaction_details_transaction_id" varchar,
  	"transaction_details_payment_proof_id" integer,
  	"transaction_details_processing_date" timestamp(3) with time zone,
  	"notes" varchar,
  	"admin_notes" jsonb,
  	"extra_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_transfer_cash_requests_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_transfer_cash_requests_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__transfer_cash_requests_v_version_type",
  	"version_amount" numeric,
  	"version_currency" "enum__transfer_cash_requests_v_version_currency" DEFAULT 'usd',
  	"version_status" "enum__transfer_cash_requests_v_version_status",
  	"version_account_id" integer,
  	"version_payment_method" "enum__transfer_cash_requests_v_version_payment_method",
  	"version_transaction_details_transaction_id" varchar,
  	"version_transaction_details_payment_proof_id" integer,
  	"version_transaction_details_processing_date" timestamp(3) with time zone,
  	"version_notes" varchar,
  	"version_admin_notes" jsonb,
  	"version_extra_data" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__transfer_cash_requests_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "transfer_cash_requests_id" integer;
  DO $$ BEGIN
   ALTER TABLE "transfer_cash_requests" ADD CONSTRAINT "transfer_cash_requests_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transfer_cash_requests" ADD CONSTRAINT "transfer_cash_requests_transaction_details_payment_proof_id_media_id_fk" FOREIGN KEY ("transaction_details_payment_proof_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_transfer_cash_requests_v" ADD CONSTRAINT "_transfer_cash_requests_v_parent_id_transfer_cash_requests_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."transfer_cash_requests"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_transfer_cash_requests_v" ADD CONSTRAINT "_transfer_cash_requests_v_version_account_id_accounts_id_fk" FOREIGN KEY ("version_account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_transfer_cash_requests_v" ADD CONSTRAINT "_transfer_cash_requests_v_version_transaction_details_payment_proof_id_media_id_fk" FOREIGN KEY ("version_transaction_details_payment_proof_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "transfer_cash_requests_account_idx" ON "transfer_cash_requests" USING btree ("account_id");
  CREATE INDEX IF NOT EXISTS "transfer_cash_requests_transaction_details_transaction_details_payment_proof_idx" ON "transfer_cash_requests" USING btree ("transaction_details_payment_proof_id");
  CREATE INDEX IF NOT EXISTS "transfer_cash_requests_updated_at_idx" ON "transfer_cash_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "transfer_cash_requests_created_at_idx" ON "transfer_cash_requests" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "transfer_cash_requests__status_idx" ON "transfer_cash_requests" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_parent_idx" ON "_transfer_cash_requests_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_version_version_account_idx" ON "_transfer_cash_requests_v" USING btree ("version_account_id");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_version_transaction_details_version_transaction_details_payment_proof_idx" ON "_transfer_cash_requests_v" USING btree ("version_transaction_details_payment_proof_id");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_version_version_updated_at_idx" ON "_transfer_cash_requests_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_version_version_created_at_idx" ON "_transfer_cash_requests_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_version_version__status_idx" ON "_transfer_cash_requests_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_created_at_idx" ON "_transfer_cash_requests_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_updated_at_idx" ON "_transfer_cash_requests_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_latest_idx" ON "_transfer_cash_requests_v" USING btree ("latest");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transfer_cash_requests_fk" FOREIGN KEY ("transfer_cash_requests_id") REFERENCES "public"."transfer_cash_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_transfer_cash_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("transfer_cash_requests_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "transfer_cash_requests";
  DROP TABLE "_transfer_cash_requests_v";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_transfer_cash_requests_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_transfer_cash_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "transfer_cash_requests_id";
  DROP TYPE "public"."enum_transfer_cash_requests_type";
  DROP TYPE "public"."enum_transfer_cash_requests_currency";
  DROP TYPE "public"."enum_transfer_cash_requests_status";
  DROP TYPE "public"."enum_transfer_cash_requests_payment_method";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_type";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_currency";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_status";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_payment_method";`)
}
