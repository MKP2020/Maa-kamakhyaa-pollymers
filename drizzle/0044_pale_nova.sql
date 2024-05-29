CREATE TABLE IF NOT EXISTS "rp" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"shift" varchar(1) NOT NULL,
	"type" integer NOT NULL,
	"consumedQty" integer,
	"rpLumps" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rpItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"rpId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"inventoryId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rpItems" ADD CONSTRAINT "rpItems_rpId_rp_id_fk" FOREIGN KEY ("rpId") REFERENCES "public"."rp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rpItems" ADD CONSTRAINT "rpItems_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rpItems" ADD CONSTRAINT "rpItems_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rpItems" ADD CONSTRAINT "rpItems_inventoryId_inventory_id_fk" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rpItems" ADD CONSTRAINT "rpItems_itemId_tableList_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rpDateIdx" ON "rp" ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rpTypeIdx" ON "rp" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rpShiftIdx" ON "rp" ("shift");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rpItemsIdIdx" ON "rpItems" ("rpId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rpItemsCategoryIdx" ON "rpItems" ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rpItemsDepartmentIdx" ON "rpItems" ("departmentId");