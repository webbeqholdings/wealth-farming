import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_notifications_type" AS ENUM('opportunity', 'account', 'alert', 'transaction', 'security');
  CREATE TABLE IF NOT EXISTS "economic_calendar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"impact" varchar,
  	"unit_id" integer,
  	"time" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "economic_calendar_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "notifications_id" integer;
  DO $$ BEGIN
   ALTER TABLE "economic_calendar" ADD CONSTRAINT "economic_calendar_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "economic_calendar_unit_idx" ON "economic_calendar" USING btree ("unit_id");
  CREATE INDEX IF NOT EXISTS "economic_calendar_updated_at_idx" ON "economic_calendar" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "economic_calendar_created_at_idx" ON "economic_calendar" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_economic_calendar_fk" FOREIGN KEY ("economic_calendar_id") REFERENCES "public"."economic_calendar"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_economic_calendar_id_idx" ON "payload_locked_documents_rels" USING btree ("economic_calendar_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "economic_calendar";
  DROP TABLE "notifications";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_economic_calendar_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_notifications_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_economic_calendar_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_notifications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "economic_calendar_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "notifications_id";
  DROP TYPE "public"."enum_notifications_type";`)
}
