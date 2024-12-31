import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "transactions" ADD COLUMN "deposit_screenshot_id" integer;
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_deposit_screenshot_id_media_id_fk" FOREIGN KEY ("deposit_screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "transactions_deposit_screenshot_idx" ON "transactions" USING btree ("deposit_screenshot_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "transactions" DROP CONSTRAINT "transactions_deposit_screenshot_id_media_id_fk";
  
  DROP INDEX IF EXISTS "transactions_deposit_screenshot_idx";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "deposit_screenshot_id";`)
}
