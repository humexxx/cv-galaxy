-- 0004 — close the drift between db/schema.ts and the committed SQL, and add the
-- (user_id, sort_order) indexes every CV read needs.
--
-- Written by hand. `drizzle-kit generate` emits only the CREATE INDEX block below:
-- the snapshots in db/migrations/meta were advanced past the SQL at some point, so
-- drizzle believes contractor_id / link / coming_soon already exist when no .sql
-- ever created them. The DDL that closes that gap is therefore added manually.
--
-- Two rules for everything in this file, because it runs against a live database:
--   * idempotent      — production may already have some of these applied out-of-band
--   * non-destructive — nothing is dropped; legacy columns are relaxed, not removed
--
-- Deliberately NOT done here: dropping work_experience.is_contractor, projects.url
-- or projects.technologies. They are unreferenced by the ORM but may still hold
-- data. See the notes beside each.

-- work_experience.contractor_id ------------------------------------------------
-- schema.ts models the contracting agency as an FK to companies; 0000 shipped a
-- boolean is_contractor instead and nothing ever created the column.
ALTER TABLE "work_experience" ADD COLUMN IF NOT EXISTS "contractor_id" uuid;--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_contractor_id_companies_id_fk"
		FOREIGN KEY ("contractor_id") REFERENCES "public"."companies"("id")
		ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint

-- work_experience.is_contractor is LEFT IN PLACE. It is boolean-only, so it cannot
-- be back-filled into contractor_id (there is no company to point at) and dropping
-- it would destroy the only record of which roles were contract work. It is
-- NOT NULL DEFAULT false, so inserts that omit it still succeed. Drop it in a
-- follow-up once the data has been reviewed.

-- projects.link / projects.coming_soon -----------------------------------------
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "link" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "coming_soon" boolean DEFAULT false;--> statement-breakpoint

-- 0000 created "url" for the same purpose. Carry any existing values across rather
-- than stranding them, then leave the old column alone.
DO $$ BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'url'
	) THEN
		EXECUTE 'UPDATE "projects" SET "link" = "url" WHERE "link" IS NULL AND "url" IS NOT NULL';
	END IF;
END $$;--> statement-breakpoint

-- projects.technologies is a legacy NOT NULL column with no default that the ORM
-- never writes, so every insert through drizzle would fail with a not-null
-- violation. Relax the constraint instead of dropping the column.
DO $$ BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'projects'
			AND column_name = 'technologies' AND is_nullable = 'NO'
	) THEN
		EXECUTE 'ALTER TABLE "projects" ALTER COLUMN "technologies" DROP NOT NULL';
	END IF;
END $$;--> statement-breakpoint

-- sort_order defaults ----------------------------------------------------------
-- schema.ts declares .default(0) on all seven child tables; 0000 created them as
-- NOT NULL with no default. Re-running SET DEFAULT is a no-op.
ALTER TABLE "work_experience" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "education" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "technologies" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "personal_values" ALTER COLUMN "sort_order" SET DEFAULT 0;--> statement-breakpoint

-- indexes ----------------------------------------------------------------------
-- Rendering one CV runs seven "WHERE user_id = $1 ORDER BY sort_order" reads, none
-- of which had an index. Composite, in that column order, so one index satisfies
-- both the filter and the sort.
CREATE INDEX IF NOT EXISTS "work_experience_user_id_sort_order_idx" ON "work_experience" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "education_user_id_sort_order_idx" ON "education" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_user_id_sort_order_idx" ON "projects" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "technologies_user_id_sort_order_idx" ON "technologies" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "languages_user_id_sort_order_idx" ON "languages" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "skills_user_id_sort_order_idx" ON "skills" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "personal_values_user_id_sort_order_idx" ON "personal_values" USING btree ("user_id","sort_order");
