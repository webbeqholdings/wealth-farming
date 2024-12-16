import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "main_menu_menu_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "main_menu_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "main_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "main_menu_menu_items_children" ADD CONSTRAINT "main_menu_menu_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_menu_menu_items" ADD CONSTRAINT "main_menu_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "main_menu_menu_items_children_order_idx" ON "main_menu_menu_items_children" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_menu_menu_items_children_parent_id_idx" ON "main_menu_menu_items_children" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "main_menu_menu_items_order_idx" ON "main_menu_menu_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_menu_menu_items_parent_id_idx" ON "main_menu_menu_items" USING btree ("_parent_id");
  ALTER TABLE "users" DROP COLUMN IF EXISTS "login_attempts";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "lock_until";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "main_menu_menu_items_children";
  DROP TABLE "main_menu_menu_items";
  DROP TABLE "main_menu";
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;`)
}
