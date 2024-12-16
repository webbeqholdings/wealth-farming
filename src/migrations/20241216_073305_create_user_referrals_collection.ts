import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "user_referrals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer NOT NULL,
  	"child_id" integer NOT NULL,
  	"referral_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "referral_code" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "user_referrals_id" integer;
  DO $$ BEGIN
   ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_child_id_users_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "user_referrals_parent_idx" ON "user_referrals" USING btree ("parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "user_referrals_child_idx" ON "user_referrals" USING btree ("child_id");
  CREATE INDEX IF NOT EXISTS "user_referrals_updated_at_idx" ON "user_referrals" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "user_referrals_created_at_idx" ON "user_referrals" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_referrals_fk" FOREIGN KEY ("user_referrals_id") REFERENCES "public"."user_referrals"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "users_referral_code_idx" ON "users" USING btree ("referral_code");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_user_referrals_id_idx" ON "payload_locked_documents_rels" USING btree ("user_referrals_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "user_referrals";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_user_referrals_fk";
  
  DROP INDEX IF EXISTS "users_referral_code_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_user_referrals_id_idx";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "referral_code";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "user_referrals_id";`)
}
