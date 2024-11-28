import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_users_gender" AS ENUM('Male', 'Female', 'Other');
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "header" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "address" ADD COLUMN "district" varchar;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD COLUMN "nation" varchar;
  ALTER TABLE "users" ADD COLUMN "gender" "enum_users_gender";
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_avatar_idx" ON "users" USING btree ("avatar_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  DROP INDEX IF EXISTS "users_avatar_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "header" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "address" DROP COLUMN IF EXISTS "district";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_id";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "nation";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "gender";
  DROP TYPE "public"."enum_users_gender";`)
}
