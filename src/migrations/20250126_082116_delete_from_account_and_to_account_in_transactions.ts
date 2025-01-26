import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_from_account_id_accounts_id_fk";
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_to_account_id_accounts_id_fk";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "from_account_id";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "to_account_id";

  DROP INDEX IF EXISTS "transactions_from_account_idx";
  DROP INDEX IF EXISTS "transactions_to_account_idx";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "transactions" ADD COLUMN "from_account_id" integer;
  ALTER TABLE "transactions" ADD COLUMN "to_account_id" integer;
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
  
  CREATE INDEX IF NOT EXISTS "transactions_from_account_idx" ON "transactions" USING btree ("from_account_id");
  CREATE INDEX IF NOT EXISTS "transactions_to_account_idx" ON "transactions" USING btree ("to_account_id");`)
}
