import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_notifications_type" ADD VALUE 'event';
  ALTER TABLE "notifications" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "notifications" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "notifications" ADD COLUMN "user_id" integer;
  DO $$ BEGIN
   ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" USING btree ("user_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_users_id_fk";
  
  DROP INDEX IF EXISTS "notifications_user_idx";
  ALTER TABLE "notifications" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "notifications" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "user_id";
  ALTER TABLE "public"."notifications" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_notifications_type";
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('opportunity', 'account', 'alert', 'transaction', 'security');
  ALTER TABLE "public"."notifications" ALTER COLUMN "type" SET DATA TYPE "public"."enum_notifications_type" USING "type"::"public"."enum_notifications_type";`)
}
