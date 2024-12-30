import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "crypto_wallets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"wallet_address" varchar,
  	"network" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "crypto_wallets_id" integer;
  DO $$ BEGIN
   ALTER TABLE "crypto_wallets" ADD CONSTRAINT "crypto_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "crypto_wallets_user_idx" ON "crypto_wallets" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "crypto_wallets_updated_at_idx" ON "crypto_wallets" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "crypto_wallets_created_at_idx" ON "crypto_wallets" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_crypto_wallets_fk" FOREIGN KEY ("crypto_wallets_id") REFERENCES "public"."crypto_wallets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_crypto_wallets_id_idx" ON "payload_locked_documents_rels" USING btree ("crypto_wallets_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "crypto_wallets";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_crypto_wallets_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_crypto_wallets_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "crypto_wallets_id";`)
}
