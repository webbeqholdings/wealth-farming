import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum__transfer_cash_requests_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'vi');
  CREATE TABLE IF NOT EXISTS "investment_products_locales" (
  	"product_name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "investment_products_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "post_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "post_categories_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "posts_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "posts_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "_posts_v_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "post_tags_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "post_tags_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "main_menu_menu_items_children_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	CONSTRAINT "main_menu_menu_items_children_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "main_menu_menu_items_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	CONSTRAINT "main_menu_menu_items_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_meta_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "posts_meta_meta_image_idx";
  DROP INDEX IF EXISTS "_posts_v_version_meta_version_meta_image_idx";
  ALTER TABLE "_transfer_cash_requests_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_transfer_cash_requests_v" ADD COLUMN "published_locale" "enum__transfer_cash_requests_v_published_locale";
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  DO $$ BEGIN
   ALTER TABLE "investment_products_locales" ADD CONSTRAINT "investment_products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investment_products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post_tags_locales" ADD CONSTRAINT "post_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_menu_menu_items_children_locales" ADD CONSTRAINT "main_menu_menu_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_menu_items_children"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_menu_menu_items_locales" ADD CONSTRAINT "main_menu_menu_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_snapshot_idx" ON "_transfer_cash_requests_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_transfer_cash_requests_v_published_locale_idx" ON "_transfer_cash_requests_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "product_name";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "post_categories" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "title";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "content";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_title";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_description";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_content";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_meta_title";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_meta_description";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_meta_image_id";
  ALTER TABLE "post_tags" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "main_menu_menu_items_children" DROP COLUMN IF EXISTS "title";
  ALTER TABLE "main_menu_menu_items_children" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "main_menu_menu_items" DROP COLUMN IF EXISTS "title";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "investment_products_locales";
  DROP TABLE "post_categories_locales";
  DROP TABLE "posts_locales";
  DROP TABLE "_posts_v_locales";
  DROP TABLE "post_tags_locales";
  DROP TABLE "main_menu_menu_items_children_locales";
  DROP TABLE "main_menu_menu_items_locales";
  DROP INDEX IF EXISTS "_transfer_cash_requests_v_snapshot_idx";
  DROP INDEX IF EXISTS "_transfer_cash_requests_v_published_locale_idx";
  DROP INDEX IF EXISTS "_posts_v_snapshot_idx";
  DROP INDEX IF EXISTS "_posts_v_published_locale_idx";
  ALTER TABLE "investment_products" ADD COLUMN "product_name" varchar NOT NULL;
  ALTER TABLE "investment_products" ADD COLUMN "description" varchar;
  ALTER TABLE "post_categories" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "post_tags" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "main_menu_menu_items_children" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "main_menu_menu_items_children" ADD COLUMN "description" varchar;
  ALTER TABLE "main_menu_menu_items" ADD COLUMN "title" varchar NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  ALTER TABLE "_transfer_cash_requests_v" DROP COLUMN IF EXISTS "snapshot";
  ALTER TABLE "_transfer_cash_requests_v" DROP COLUMN IF EXISTS "published_locale";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__transfer_cash_requests_v_published_locale";
  DROP TYPE "public"."enum__posts_v_published_locale";`)
}
