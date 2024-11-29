import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "investment_products" ADD COLUMN "start_date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "investment_products" ADD COLUMN "end_date" timestamp(3) with time zone NOT NULL;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "start_date";
  ALTER TABLE "investment_products" DROP COLUMN IF EXISTS "end_date";`)
}
