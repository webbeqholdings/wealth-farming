import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "contracts" ALTER COLUMN "profit" SET DEFAULT 0;
  ALTER TABLE "contracts" ALTER COLUMN "periods" SET DEFAULT null;
  ALTER TABLE "contracts" ALTER COLUMN "end_date" SET DEFAULT null;
  ALTER TABLE "transactions" ADD COLUMN "account_from_id" integer;
  ALTER TABLE "transactions" ADD COLUMN "account_to_id" integer;
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_from_id_accounts_id_fk" FOREIGN KEY ("account_from_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_to_id_accounts_id_fk" FOREIGN KEY ("account_to_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "transactions_account_from_idx" ON "transactions" USING btree ("account_from_id");
  CREATE INDEX IF NOT EXISTS "transactions_account_to_idx" ON "transactions" USING btree ("account_to_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_from_id_accounts_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_to_id_accounts_id_fk";
  
  DROP INDEX IF EXISTS "transactions_account_from_idx";
  DROP INDEX IF EXISTS "transactions_account_to_idx";
  ALTER TABLE "contracts" ALTER COLUMN "profit" DROP DEFAULT;
  ALTER TABLE "contracts" ALTER COLUMN "periods" DROP DEFAULT;
  ALTER TABLE "contracts" ALTER COLUMN "end_date" DROP DEFAULT;
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "account_from_id";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "account_to_id";`)
}
