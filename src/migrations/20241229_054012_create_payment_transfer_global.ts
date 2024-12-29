import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
  DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_gc_payment_transfer_crypto_wallet_network') THEN
          CREATE TYPE "public"."enum_gc_payment_transfer_crypto_wallet_network" AS ENUM('TRC20');
      END IF;
  END $$;

  CREATE TABLE IF NOT EXISTS "gc_payment_transfer" (
      "id" serial PRIMARY KEY NOT NULL,
      "bank_qr_code_id" integer,
      "bank_account_number" varchar,
      "bank_account_description" varchar,
      "crypto_wallet_qr_code_id" integer,
      "crypto_wallet_address" varchar,
      "crypto_wallet_network" "public"."enum_gc_payment_transfer_crypto_wallet_network" DEFAULT 'TRC20',
      "usd_to_vnd" numeric DEFAULT 25455,
      "usdt_to_vnd" numeric DEFAULT 25455,
      "usd_to_usdt" numeric DEFAULT 1,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
  );

  
  DO $$ BEGIN
   ALTER TABLE "gc_payment_transfer" ADD CONSTRAINT "gc_payment_transfer_bank_qr_code_id_media_id_fk" FOREIGN KEY ("bank_qr_code_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "gc_payment_transfer" ADD CONSTRAINT "gc_payment_transfer_crypto_wallet_qr_code_id_media_id_fk" FOREIGN KEY ("crypto_wallet_qr_code_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "gc_payment_transfer_bank_qr_code_idx" ON "gc_payment_transfer" USING btree ("bank_qr_code_id");
  CREATE INDEX IF NOT EXISTS "gc_payment_transfer_crypto_wallet_qr_code_idx" ON "gc_payment_transfer" USING btree ("crypto_wallet_qr_code_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "gc_payment_transfer";
  DROP TYPE "public"."enum_gc_payment_transfer_crypto_wallet_network";`)
}
