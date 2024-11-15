import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'individual', 'company');
  CREATE TYPE "public"."enum_investment_funds_status" AS ENUM('active', 'closed');
  CREATE TYPE "public"."enum_investment_products_profit_period" AS ENUM('monthly', 'quarterly', 'semi_annually', 'annually');
  CREATE TYPE "public"."enum_investment_products_status" AS ENUM('available', 'unavailable');
  CREATE TYPE "public"."enum_contracts_status" AS ENUM('active', 'inactive', 'pending', 'closed');
  CREATE TYPE "public"."enum_transactions_status" AS ENUM('pending', 'completed', 'failed');
  CREATE TYPE "public"."enum_transactions_type" AS ENUM('deposit', 'withdraw', 'bonus', 'manage_fee');
  CREATE TABLE IF NOT EXISTS "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"account_name" varchar NOT NULL,
  	"account_number" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "news_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category_id" integer,
  	"user_id" integer,
  	"title" varchar,
  	"content" varchar,
  	"published_date" timestamp(3) with time zone,
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
  	"role" "enum_users_role" DEFAULT 'individual' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"company_name" varchar,
  	"registration_number" varchar,
  	"phone_contact" varchar,
  	"date_of_birth" timestamp(3) with time zone,
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
  	"alt" varchar NOT NULL,
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
  	"interest_rate_from" numeric NOT NULL,
  	"interest_rate_to" numeric NOT NULL,
  	"profit_period" "enum_investment_products_profit_period" NOT NULL,
  	"status" "enum_investment_products_status" NOT NULL,
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
  
  CREATE TABLE IF NOT EXISTS "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contract_id_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"status" "enum_transactions_status" NOT NULL,
  	"from_account_id" integer,
  	"to_account_id" integer,
  	"type" "enum_transactions_type" NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"news_categories_id" integer,
  	"news_id" integer,
  	"address_id" integer,
  	"banks_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"companies_id" integer,
  	"investment_funds_id" integer,
  	"investment_products_id" integer,
  	"contracts_id" integer,
  	"transactions_id" integer
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
  	"logo_id" integer NOT NULL,
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
   ALTER TABLE "news" ADD CONSTRAINT "news_category_id_news_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."news_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "news" ADD CONSTRAINT "news_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
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
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_contract_id_id_contracts_id_fk" FOREIGN KEY ("contract_id_id") REFERENCES "public"."contracts"("id") ON DELETE set null ON UPDATE no action;
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
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
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
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contracts_fk" FOREIGN KEY ("contracts_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX IF NOT EXISTS "news_categories_updated_at_idx" ON "news_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "news_categories_created_at_idx" ON "news_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "news_category_idx" ON "news" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "news_user_idx" ON "news" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "address_user_idx" ON "address" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "address_updated_at_idx" ON "address" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "address_created_at_idx" ON "address" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "banks_user_idx" ON "banks" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "banks_updated_at_idx" ON "banks" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "banks_created_at_idx" ON "banks" USING btree ("created_at");
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
  CREATE INDEX IF NOT EXISTS "contracts_product_id_idx" ON "contracts" USING btree ("product_id_id");
  CREATE INDEX IF NOT EXISTS "contracts_account_id_idx" ON "contracts" USING btree ("account_id_id");
  CREATE INDEX IF NOT EXISTS "contracts_updated_at_idx" ON "contracts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contracts_created_at_idx" ON "contracts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "transactions_contract_id_idx" ON "transactions" USING btree ("contract_id_id");
  CREATE INDEX IF NOT EXISTS "transactions_from_account_idx" ON "transactions" USING btree ("from_account_id");
  CREATE INDEX IF NOT EXISTS "transactions_to_account_idx" ON "transactions" USING btree ("to_account_id");
  CREATE INDEX IF NOT EXISTS "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_news_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("news_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_address_id_idx" ON "payload_locked_documents_rels" USING btree ("address_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_banks_id_idx" ON "payload_locked_documents_rels" USING btree ("banks_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_companies_id_idx" ON "payload_locked_documents_rels" USING btree ("companies_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_funds_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_funds_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_products_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contracts_id_idx" ON "payload_locked_documents_rels" USING btree ("contracts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
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
  DROP TABLE "news_categories";
  DROP TABLE "news";
  DROP TABLE "address";
  DROP TABLE "banks";
  DROP TABLE "users";
  DROP TABLE "media";
  DROP TABLE "companies";
  DROP TABLE "investment_funds";
  DROP TABLE "investment_products";
  DROP TABLE "contracts";
  DROP TABLE "transactions";
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
  DROP TYPE "public"."enum_investment_funds_status";
  DROP TYPE "public"."enum_investment_products_profit_period";
  DROP TYPE "public"."enum_investment_products_status";
  DROP TYPE "public"."enum_contracts_status";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_transactions_type";`)
}
