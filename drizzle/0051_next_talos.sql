CREATE TABLE IF NOT EXISTS "tapeItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"tapeId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"inventoryId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tapePlant" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"shift" varchar(1) NOT NULL,
	"tapeGrade" integer NOT NULL,
	"tapeQty" integer NOT NULL,
	"tapeWaste" integer NOT NULL,
	"tapeLumps" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tapePlantConsumedItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"tapeId" integer NOT NULL,
	"rpType" integer NOT NULL,
	"qty" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapeItem" ADD CONSTRAINT "tapeItem_tapeId_tapePlant_id_fk" FOREIGN KEY ("tapeId") REFERENCES "public"."tapePlant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapeItem" ADD CONSTRAINT "tapeItem_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapeItem" ADD CONSTRAINT "tapeItem_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapeItem" ADD CONSTRAINT "tapeItem_inventoryId_inventory_id_fk" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapeItem" ADD CONSTRAINT "tapeItem_itemId_tableList_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapePlant" ADD CONSTRAINT "tapePlant_tapeGrade_grades_id_fk" FOREIGN KEY ("tapeGrade") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapePlantConsumedItem" ADD CONSTRAINT "tapePlantConsumedItem_tapeId_tapePlant_id_fk" FOREIGN KEY ("tapeId") REFERENCES "public"."tapePlant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tapeItemsIdIdx" ON "tapeItem" ("tapeId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tapeItemsCategoryIdx" ON "tapeItem" ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tapeItemsDepartmentIdx" ON "tapeItem" ("departmentId");