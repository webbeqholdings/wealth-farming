import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "otp" varchar;
  ALTER TABLE "users" ADD COLUMN "otp_expires_at" timestamp(3) with time zone;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "otp";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "otp_expires_at";`)
}
