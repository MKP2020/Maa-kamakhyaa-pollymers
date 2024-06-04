CREATE TABLE IF NOT EXISTS "loom" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"shift" varchar(1) NOT NULL,
	"tapeGradeId" integer NOT NULL,
	"tapeQty" integer NOT NULL,
	"fabricGradeId" integer NOT NULL,
	"fabricQty" integer NOT NULL,
	"loomWaste" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loomItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"loomId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"inventoryId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loom" ADD CONSTRAINT "loom_tapeGradeId_grades_id_fk" FOREIGN KEY ("tapeGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loom" ADD CONSTRAINT "loom_fabricGradeId_grades_id_fk" FOREIGN KEY ("fabricGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loomItem" ADD CONSTRAINT "loomItem_loomId_loom_id_fk" FOREIGN KEY ("loomId") REFERENCES "public"."loom"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loomItem" ADD CONSTRAINT "loomItem_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loomItem" ADD CONSTRAINT "loomItem_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loomItem" ADD CONSTRAINT "loomItem_inventoryId_inventory_id_fk" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loomItem" ADD CONSTRAINT "loomItem_itemId_tableList_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loomItemsIdIdx" ON "loomItem" ("loomId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loomItemsCategoryIdx" ON "loomItem" ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loomItemsDepartmentIdx" ON "loomItem" ("departmentId");