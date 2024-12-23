import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "contracts" DROP COLUMN IF EXISTS "expected_return";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "contracts" ADD COLUMN "expected_return" numeric;`)
}
