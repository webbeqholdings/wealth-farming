import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
  DROP INDEX IF EXISTS "payload_locked_documents_rels_investment_profit_loss_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_investment_profit_loss_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "investment_profit_loss_id";
   DROP TABLE "investment_profit_loss";
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "investment_profit_loss" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"investment_product_id" integer NOT NULL,
  	"profit_or_loss" numeric NOT NULL,
  	"unit_id" integer NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "investment_profit_loss_id" integer;
  DO $$ BEGIN
   ALTER TABLE "investment_profit_loss" ADD CONSTRAINT "investment_profit_loss_investment_product_id_investment_products_id_fk" FOREIGN KEY ("investment_product_id") REFERENCES "public"."investment_products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "investment_profit_loss" ADD CONSTRAINT "investment_profit_loss_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_investment_product_idx" ON "investment_profit_loss" USING btree ("investment_product_id");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_unit_idx" ON "investment_profit_loss" USING btree ("unit_id");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_updated_at_idx" ON "investment_profit_loss" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "investment_profit_loss_created_at_idx" ON "investment_profit_loss" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investment_profit_loss_fk" FOREIGN KEY ("investment_profit_loss_id") REFERENCES "public"."investment_profit_loss"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_investment_profit_loss_id_idx" ON "payload_locked_documents_rels" USING btree ("investment_profit_loss_id");`)
}
