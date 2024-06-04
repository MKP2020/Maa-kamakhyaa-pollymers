CREATE TABLE IF NOT EXISTS "lamItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"lamId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"inventoryId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lamination" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"shift" varchar(1) NOT NULL,
	"fabricGradeId" integer NOT NULL,
	"fabricQty" integer NOT NULL,
	"lamFabricGradeId" integer NOT NULL,
	"lamFabricQty" integer NOT NULL,
	"lamWaste" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamItem" ADD CONSTRAINT "lamItem_lamId_lamination_id_fk" FOREIGN KEY ("lamId") REFERENCES "public"."lamination"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamItem" ADD CONSTRAINT "lamItem_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamItem" ADD CONSTRAINT "lamItem_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamItem" ADD CONSTRAINT "lamItem_inventoryId_inventory_id_fk" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamItem" ADD CONSTRAINT "lamItem_itemId_tableList_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamination" ADD CONSTRAINT "lamination_fabricGradeId_grades_id_fk" FOREIGN KEY ("fabricGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lamination" ADD CONSTRAINT "lamination_lamFabricGradeId_grades_id_fk" FOREIGN KEY ("lamFabricGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lamItemsIdIdx" ON "lamItem" ("lamId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lamItemsCategoryIdx" ON "lamItem" ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lamItemsDepartmentIdx" ON "lamItem" ("departmentId");