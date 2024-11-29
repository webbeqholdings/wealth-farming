import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "posts_related_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"related_post_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v_version_related_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"related_post_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE jsonb;
  DO $$ BEGIN
   ALTER TABLE "posts_related_posts" ADD CONSTRAINT "posts_related_posts_related_post_id_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_related_posts" ADD CONSTRAINT "posts_related_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_version_related_posts" ADD CONSTRAINT "_posts_v_version_related_posts_related_post_id_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_version_related_posts" ADD CONSTRAINT "_posts_v_version_related_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "posts_related_posts_order_idx" ON "posts_related_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "posts_related_posts_parent_id_idx" ON "posts_related_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "posts_related_posts_related_post_idx" ON "posts_related_posts" USING btree ("related_post_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_related_posts_order_idx" ON "_posts_v_version_related_posts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_related_posts_parent_id_idx" ON "_posts_v_version_related_posts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_related_posts_related_post_idx" ON "_posts_v_version_related_posts" USING btree ("related_post_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "posts_related_posts";
  DROP TABLE "_posts_v_version_related_posts";
  ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE varchar;`)
}
