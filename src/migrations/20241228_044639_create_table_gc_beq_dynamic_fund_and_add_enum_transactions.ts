import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_accounts_type" AS ENUM('investment', 'main', 'referral_reward');
  ALTER TYPE "public"."enum_transactions_type" ADD VALUE 'referral_reward';
  CREATE TABLE IF NOT EXISTS "gc_beq_dynamic_fund" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"before_standard_product_id" integer,
  	"standard_days" numeric DEFAULT 90,
  	"referral_config_rates" jsonb DEFAULT '[{"name":"Level 1","min":0,"max":10000,"rate":0.01},{"name":"Level 2","min":10000,"max":50000,"rate":0.02},{"name":"Level 3","min":50000,"max":10000000000,"rate":0.03}]'::jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "gc_beq_dynamic_fund_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"investment_products_id" integer,
  	"users_id" integer
  );
  
  ALTER TABLE "accounts" ADD COLUMN "type" "enum_accounts_type" DEFAULT 'investment';
  DO $$ BEGIN
   ALTER TABLE "gc_beq_dynamic_fund" ADD CONSTRAINT "gc_beq_dynamic_fund_before_standard_product_id_investment_products_id_fk" FOREIGN KEY ("before_standard_product_id") REFERENCES "public"."investment_products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "gc_beq_dynamic_fund_rels" ADD CONSTRAINT "gc_beq_dynamic_fund_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gc_beq_dynamic_fund"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "gc_beq_dynamic_fund_rels" ADD CONSTRAINT "gc_beq_dynamic_fund_rels_investment_products_fk" FOREIGN KEY ("investment_products_id") REFERENCES "public"."investment_products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "gc_beq_dynamic_fund_rels" ADD CONSTRAINT "gc_beq_dynamic_fund_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "gc_beq_dynamic_fund_before_standard_product_idx" ON "gc_beq_dynamic_fund" USING btree ("before_standard_product_id");
  CREATE INDEX IF NOT EXISTS "gc_beq_dynamic_fund_rels_order_idx" ON "gc_beq_dynamic_fund_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "gc_beq_dynamic_fund_rels_parent_idx" ON "gc_beq_dynamic_fund_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "gc_beq_dynamic_fund_rels_path_idx" ON "gc_beq_dynamic_fund_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "gc_beq_dynamic_fund_rels_investment_products_id_idx" ON "gc_beq_dynamic_fund_rels" USING btree ("investment_products_id");
  CREATE INDEX IF NOT EXISTS "gc_beq_dynamic_fund_rels_users_id_idx" ON "gc_beq_dynamic_fund_rels" USING btree ("users_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Drop tables with cascade
    DROP TABLE IF EXISTS "gc_beq_dynamic_fund_rels" CASCADE;
    DROP TABLE IF EXISTS "gc_beq_dynamic_fund" CASCADE;

    -- Alter 'accounts' table
    ALTER TABLE "accounts" DROP COLUMN IF EXISTS "type";

    -- Alter 'transactions' table type safely
    ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE text;

    -- Drop and recreate 'enum_transactions_type' with cascade
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transactions_type') THEN
        DROP TYPE "public"."enum_transactions_type" CASCADE;
      END IF;
    END $$;
    CREATE TYPE "public"."enum_transactions_type" AS ENUM('deposit', 'withdraw', 'bonus', 'transfer', 'investment');
    ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE "public"."enum_transactions_type" USING "type"::"public"."enum_transactions_type";

    -- Drop 'enum_accounts_type' safely with cascade
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_accounts_type') THEN
        DROP TYPE "public"."enum_accounts_type" CASCADE;
      END IF;
    END $$;
  `);
}

