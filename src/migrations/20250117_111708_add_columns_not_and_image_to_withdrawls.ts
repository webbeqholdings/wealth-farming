import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "withdrawals" ADD COLUMN "note" varchar;
  ALTER TABLE "withdrawals" ADD COLUMN "image_id" integer;
  DO $$ BEGIN
   ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "withdrawals_image_idx" ON "withdrawals" USING btree ("image_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "withdrawals" DROP CONSTRAINT "withdrawals_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "withdrawals_image_idx";
  ALTER TABLE "withdrawals" DROP COLUMN IF EXISTS "note";
  ALTER TABLE "withdrawals" DROP COLUMN IF EXISTS "image_id";`)
}
