import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
  DO $$
BEGIN
    -- Check if the enum_users_role type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
        CREATE TYPE "public"."enum_users_role" AS ENUM ('admin', 'individual', 'company');
    END IF;

    -- Check if the enum_users_gender type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_gender') THEN
        CREATE TYPE "public"."enum_users_gender" AS ENUM ('Male', 'Female', 'Other');
    END IF;

    -- Check if the enum_investment_funds_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_investment_funds_status') THEN
        CREATE TYPE "public"."enum_investment_funds_status" AS ENUM ('active', 'closed');
    END IF;

    -- Check if the enum_investment_products_profit_period type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_investment_products_profit_period') THEN
        CREATE TYPE "public"."enum_investment_products_profit_period" AS ENUM ('monthly', 'quarterly', 'semi_annually', 'annually');
    END IF;

    -- Check if the enum_investment_products_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_investment_products_status') THEN
        CREATE TYPE "public"."enum_investment_products_status" AS ENUM ('available', 'unavailable');
    END IF;

    -- Check if the enum_contracts_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_contracts_status') THEN
        CREATE TYPE "public"."enum_contracts_status" AS ENUM ('active', 'inactive', 'pending', 'closed');
    END IF;

    -- Check if the enum_transactions_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transactions_status') THEN
        CREATE TYPE "public"."enum_transactions_status" AS ENUM ('pending', 'completed', 'failed');
    END IF;

    -- Check if the enum_transactions_type type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transactions_type') THEN
        CREATE TYPE "public"."enum_transactions_type" AS ENUM ('deposit', 'withdraw', 'bonus', 'transfer', 'investment');
    END IF;

    -- Check if the enum_posts_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_posts_status') THEN
        CREATE TYPE "public"."enum_posts_status" AS ENUM ('draft', 'published');
    END IF;

    -- Check if the enum__posts_v_version_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__posts_v_version_status') THEN
        CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM ('draft', 'published');
    END IF;

    -- Check if the enum_transfer_cash_requests_type type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transfer_cash_requests_type') THEN
        CREATE TYPE "public"."enum_transfer_cash_requests_type" AS ENUM ('deposit', 'withdrawal', 'bonus');
    END IF;

    -- Check if the enum_transfer_cash_requests_currency type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transfer_cash_requests_currency') THEN
        CREATE TYPE "public"."enum_transfer_cash_requests_currency" AS ENUM ('usd', 'vnd');
    END IF;

    -- Check if the enum_transfer_cash_requests_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transfer_cash_requests_status') THEN
        CREATE TYPE "public"."enum_transfer_cash_requests_status" AS ENUM ('draft', 'published');
    END IF;

    -- Check if the enum_transfer_cash_requests_payment_method type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transfer_cash_requests_payment_method') THEN
        CREATE TYPE "public"."enum_transfer_cash_requests_payment_method" AS ENUM ('bank_transfer', 'credit_card', 'paypal', 'crypto');
    END IF;

    -- Check if the enum__transfer_cash_requests_v_version_type type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__transfer_cash_requests_v_version_type') THEN
        CREATE TYPE "public"."enum__transfer_cash_requests_v_version_type" AS ENUM ('deposit', 'withdrawal', 'bonus');
    END IF;

    -- Check if the enum__transfer_cash_requests_v_version_currency type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__transfer_cash_requests_v_version_currency') THEN
        CREATE TYPE "public"."enum__transfer_cash_requests_v_version_currency" AS ENUM ('usd', 'vnd');
    END IF;

    -- Check if the enum__transfer_cash_requests_v_version_status type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__transfer_cash_requests_v_version_status') THEN
        CREATE TYPE "public"."enum__transfer_cash_requests_v_version_status" AS ENUM ('draft', 'published');
    END IF;

    -- Check if the enum__transfer_cash_requests_v_version_payment_method type exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__transfer_cash_requests_v_version_payment_method') THEN
        CREATE TYPE "public"."enum__transfer_cash_requests_v_version_payment_method" AS ENUM ('bank_transfer', 'credit_card', 'paypal', 'crypto');
    END IF;
END $$;

  CREATE TABLE IF NOT EXISTS "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"account_name" varchar NOT NULL,
  	"account_number" numeric DEFAULT 0 NOT NULL,
  	"amount" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "address" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"street" varchar,
  	"district" varchar,
  	"city" varchar,
  	"state" varchar,
  	"zip_code" varchar,
  	"country" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"telegram_id" integer,
  	"first_name" varchar,
  	"last_name" varchar,
  	"role" "enum_users_role" DEFAULT 'individual' NOT NULL,
  	"company_name" varchar,
  	"registration_number" varchar,
  	"phone_contact" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"nation" varchar,
  	"gender" "enum_users_gender",
  	"email_verified" boolean DEFAULT false,
  	"otp" varchar,
  	"otp_expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "companies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"registration_number" varchar,
  	"address" varchar,
  	"contact_person_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "investment_funds" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"category" varchar,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"interest_rate" numeric NOT NULL,
  	"min_investment" numeric NOT NULL,
  	"max_investment" numeric,
  	"fund_manager_id" integer NOT NULL,
  	"status" "enum_investment_funds_status" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "investment_products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fund_id" integer NOT NULL,
  	"product_name" varchar NOT NULL,
  	"description" varchar,
  	"min_investment" numeric NOT NULL,
  	"max_investment" numeric,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"interest_rate_from" numeric NOT NULL,
  	"interest_rate_to" numeric NOT NULL,
  	"profit_period" "enum_investment_products_profit_period" NOT NULL,
  	"status" "enum_investment_products_status" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "investment_profit_loss" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"investment_product_id" integer NOT NULL,
  	"profit_or_loss" numeric NOT NULL,
  	"unit_id" integer NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "contracts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id_id" integer NOT NULL,
  	"account_id_id" integer NOT NULL,
  	"status" "enum_contracts_status" NOT NULL,
  	"amount" numeric NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "telegram" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"chat_id" numeric,
  	"first_name" varchar,
  	"last_name" varchar,
  	"auth_date" varchar,
  	"hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"investment_product_id" integer,
  	"profit_or_loss" numeric DEFAULT 0,
  	"unit_id" integer,
  	"bank_id" integer,
  	"amount" numeric NOT NULL,
  	"status" "enum_transactions_status" NOT NULL,
  	"from_account_id" integer,
  	"to_account_id" integer,
  	"type" "enum_transactions_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"post_tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "posts_related_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"related_post_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"author_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"category_id" integer,
  	"content" jsonb,
  	"status" "enum_posts_status" DEFAULT 'draft',
  	"featured_image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_tags_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v_version_related_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"related_post_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_author_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_category_id" integer,
  	"version_content" jsonb,
  	"version_status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"version_featured_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "post_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_name" varchar NOT NULL,
  	"unit_code" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"accounts_id" integer,
  	"address_id" integer,
  	"banks_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"companies_id" integer,
  	"investment_funds_id" integer,
  	"investment_products_id" integer,
  	"investment_profit_loss_id" integer,
  	"contracts_id" integer,
  	"telegram_id" integer,
  	"transactions_id" integer,
  	"post_categories_id" integer,
  	"posts_id" integer,
  	"post_tags_id" integer,
  	"transfer_cash_requests_id" integer,
  	"units_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"support_email" varchar NOT NULL,
  	"support_phone" varchar,
  	"contact_address" varchar,
  	"qr_codes_id" integer,
  	"business_hours" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header_social_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"contact_info" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_social_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"copyright_text" varchar NOT NULL,
  	"privacy_policy_link" varchar,
  	"about_us_link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "address" ADD CONSTRAINT "address_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_telegram_id_telegram_id_fk" FOREIGN KEY ("telegram_id") REFERENCES "public"."telegram"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "companies" ADD CONSTRAINT "companies_contact_person_id_users_id_fk" FOREIGN KEY ("contact_person_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "investment_funds" ADD CONSTRAINT "investment_funds_fund_manager_id_users_id_fk" FOREIGN KEY ("fund_manager_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "investment_products" ADD CONSTRAINT "investment_products_fund_id_investment_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."investment_funds"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_from_account_id_accounts_id_fk" FOREIGN KEY ("from_account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_to_account_id_accounts_id_fk" FOREIGN KEY ("to_account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_post_tags_id_post_tags_id_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_related_posts" ADD CONSTRAINT "posts_related_posts_related_post_id_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_related_posts" ADD CONSTRAINT "posts_related_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_post_tags_id_post_tags_id_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_version_related_posts" ADD CONSTRAINT "_posts_v_version_related_posts_related_post_id_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_version_related_posts" ADD CONSTRAINT "_posts_v_version_related_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accounts_fk" FOREIGN KEY ("accounts_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_address_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_banks_fk" FOREIGN KEY ("banks_id") REFERENCES "public"."banks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investment_funds_fk" FOREIGN KEY ("investment_funds_id") REFERENCES "public"."investment_funds"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investment_products_fk" FOREIGN KEY ("investment_products_id") REFERENCES "public"."investment_products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investment_profit_loss_fk" FOREIGN KEY ("investment_profit_loss_id") REFERENCES "public"."investment_profit_loss"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contracts_fk" FOREIGN KEY ("contracts_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_telegram_fk" FOREIGN KEY ("telegram_id") REFERENCES "public"."telegram"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_tags_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transfer_cash_requests_fk" FOREIGN KEY ("transfer_cash_requests_id") REFERENCES "public"."transfer_cash_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_units_fk" FOREIGN KEY ("units_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_qr_codes_id_media_id_fk" FOREIGN KEY ("qr_codes_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_navigation_links" ADD CONSTRAINT "header_navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_social_media_links" ADD CONSTRAINT "header_social_media_links_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_social_media_links" ADD CONSTRAINT "header_social_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_social_media_links" ADD CONSTRAINT "footer_social_media_links_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_social_media_links" ADD CONSTRAINT "footer_social_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "accounts_user_idx" ON "accounts" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "accounts_updated_at_idx" ON "accounts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "accounts_created_at_idx" ON "accounts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "address_user_idx" ON "address" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "address_updated_at_idx" ON "address" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "address_created_at_idx" ON "address" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "banks_user_idx" ON "banks" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "banks_updated_at_idx" ON "banks" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "banks_created_at_idx" ON "banks" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "users_telegram_idx" ON "users" USING btree ("telegram_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "companies_contact_person_idx" ON "companies" USING btree ("contact_person_id");
  CREATE INDEX IF NOT EXISTS "companies_updated_at_idx" ON "companies" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "companies_created_at_idx" ON "companies" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "investment_funds_fund_manager_idx" ON "investment_funds" USING btree ("fund_manager_id");
  CREATE INDEX IF NOT EXISTS "investment_funds_updated_at_idx" ON "investment_funds" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "investment_funds_created_at_idx" ON "investment_funds" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "investment_products_fund_idx" ON "investment_products" USING btree ("fund_id");
  CREATE INDEX IF NOT EXISTS "investment_products_updated_at_idx" ON "investment_products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "investment_products_created_at_idx" ON "investment_products" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_investment_product_idx" ON "investment_profit_loss" USING btree ("investment_product_id");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_unit_idx" ON "investment_profit_loss" USING btree ("unit_id");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_updated_at_idx" ON "investment_profit_loss" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_created_at_idx" ON "investment_profit_loss" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "contracts_product_id_idx" ON "contracts" USING btree ("product_id_id");
  CREATE INDEX IF NOT EXISTS "contracts_account_id_idx" ON "contracts" USING btree ("account_id_id");
  CREATE INDEX IF NOT EXISTS "contracts_updated_at_idx" ON "contracts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contracts_created_at_idx" ON "contracts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "telegram_updated_at_idx" ON "telegram" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "telegram_created_at_idx" ON "telegram" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "transactions_user_idx" ON "transactions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "transactions_investment_product_idx" ON "transactions" USING btree ("investment_product_id");
  CREATE INDEX IF NOT EXISTS "transactions_unit_idx" ON "transactions" USING btree ("unit_id");
  CREATE INDEX IF NOT EXISTS "transactions_bank_idx" ON "transactions" USING btree ("bank_id");
  CREATE INDEX IF NOT EXISTS "transactions_from_account_idx" ON "transactions" USING btree ("from_account_id");
  CREATE INDEX IF NOT EXISTS "transactions_to_account_idx" ON "transactions" USING btree ("to_account_id");
  CREATE INDEX IF NOT EXISTS "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "posts_tags_post_tags_idx" ON "posts_tags" USING btree ("post_tags_id");
  CREATE INDEX IF NOT EXISTS "posts_related_posts_order_idx" ON "posts_related_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "posts_related_posts_parent_id_idx" ON "posts_related_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "posts_related_posts_related_post_idx" ON "posts_related_posts" USING btree ("related_post_id");
  CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_tags_post_tags_idx" ON "_posts_v_version_tags" USING btree ("post_tags_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_related_posts_order_idx" ON "_posts_v_version_related_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_related_posts_parent_id_idx" ON "_posts_v_version_related_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_related_posts_related_post_idx" ON "_posts_v_version_related_posts" USING btree ("related_post_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX IF NOT EXISTS "post_tags_slug_idx" ON "post_tags" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "post_tags_updated_at_idx" ON "post_tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "post_tags_created_at_idx" ON "post_tags" USING btree ("created_at");
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
  CREATE UNIQUE INDEX IF NOT EXISTS "units_unit_code_idx" ON "units" USING btree ("unit_code");
  CREATE INDEX IF NOT EXISTS "units_updated_at_idx" ON "units" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "units_created_at_idx" ON "units" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_address_id_idx" ON "payload_locked_documents_rels" USING btree ("address_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_banks_id_idx" ON "payload_locked_documents_rels" USING btree ("banks_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_companies_id_idx" ON "payload_locked_documents_rels" USING btree ("companies_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_funds_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_funds_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_products_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_profit_loss_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_profit_loss_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contracts_id_idx" ON "payload_locked_documents_rels" USING btree ("contracts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_telegram_id_idx" ON "payload_locked_documents_rels" USING btree ("telegram_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_post_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("post_tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_transfer_cash_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("transfer_cash_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_units_id_idx" ON "payload_locked_documents_rels" USING btree ("units_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_settings_qr_codes_idx" ON "site_settings" USING btree ("qr_codes_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_links_order_idx" ON "header_navigation_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_navigation_links_parent_id_idx" ON "header_navigation_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_social_media_links_order_idx" ON "header_social_media_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_social_media_links_parent_id_idx" ON "header_social_media_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_social_media_links_icon_idx" ON "header_social_media_links" USING btree ("icon_id");
  CREATE INDEX IF NOT EXISTS "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "footer_social_media_links_order_idx" ON "footer_social_media_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_social_media_links_parent_id_idx" ON "footer_social_media_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_social_media_links_icon_idx" ON "footer_social_media_links" USING btree ("icon_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "accounts";
  DROP TABLE "address";
  DROP TABLE "banks";
  DROP TABLE "users";
  DROP TABLE "media";
  DROP TABLE "companies";
  DROP TABLE "investment_funds";
  DROP TABLE "investment_products";
  DROP TABLE "investment_profit_loss";
  DROP TABLE "contracts";
  DROP TABLE "telegram";
  DROP TABLE "transactions";
  DROP TABLE "post_categories";
  DROP TABLE "posts_tags";
  DROP TABLE "posts_related_posts";
  DROP TABLE "posts";
  DROP TABLE "_posts_v_version_tags";
  DROP TABLE "_posts_v_version_related_posts";
  DROP TABLE "_posts_v";
  DROP TABLE "post_tags";
  DROP TABLE "transfer_cash_requests";
  DROP TABLE "_transfer_cash_requests_v";
  DROP TABLE "units";
  DROP TABLE "payload_locked_documents";
  DROP TABLE "payload_locked_documents_rels";
  DROP TABLE "payload_preferences";
  DROP TABLE "payload_preferences_rels";
  DROP TABLE "payload_migrations";
  DROP TABLE "site_settings_social_links";
  DROP TABLE "site_settings";
  DROP TABLE "header_navigation_links";
  DROP TABLE "header_social_media_links";
  DROP TABLE "header";
  DROP TABLE "footer_social_media_links";
  DROP TABLE "footer";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_gender";
  DROP TYPE "public"."enum_investment_funds_status";
  DROP TYPE "public"."enum_investment_products_profit_period";
  DROP TYPE "public"."enum_investment_products_status";
  DROP TYPE "public"."enum_contracts_status";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_transactions_type";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_transfer_cash_requests_type";
  DROP TYPE "public"."enum_transfer_cash_requests_currency";
  DROP TYPE "public"."enum_transfer_cash_requests_status";
  DROP TYPE "public"."enum_transfer_cash_requests_payment_method";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_type";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_currency";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_status";
  DROP TYPE "public"."enum__transfer_cash_requests_v_version_payment_method";`)
}
