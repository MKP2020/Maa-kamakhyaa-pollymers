ALTER TABLE "inventory" ADD COLUMN "poItemId" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "poItemIdx" ON "inventory" ("poItemId");