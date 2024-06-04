CREATE TABLE IF NOT EXISTS "tarpaulin" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"shift" varchar(1) NOT NULL,
	"lamFabricGradeId" integer NOT NULL,
	"lamFabricQty" integer NOT NULL,
	"tarpaulinGradeId" integer NOT NULL,
	"tarpaulinQty" integer NOT NULL,
	"tarpaulinSize" integer NOT NULL,
	"tarpWaste" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tarpaulinItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"tarpId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"inventoryId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulin" ADD CONSTRAINT "tarpaulin_lamFabricGradeId_grades_id_fk" FOREIGN KEY ("lamFabricGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulin" ADD CONSTRAINT "tarpaulin_tarpaulinGradeId_grades_id_fk" FOREIGN KEY ("tarpaulinGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulinItem" ADD CONSTRAINT "tarpaulinItem_tarpId_tarpaulin_id_fk" FOREIGN KEY ("tarpId") REFERENCES "public"."tarpaulin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulinItem" ADD CONSTRAINT "tarpaulinItem_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulinItem" ADD CONSTRAINT "tarpaulinItem_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulinItem" ADD CONSTRAINT "tarpaulinItem_inventoryId_inventory_id_fk" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tarpaulinItem" ADD CONSTRAINT "tarpaulinItem_itemId_tableList_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tarpShiftIdx" ON "tarpaulin" ("shift");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tarpDateIdx" ON "tarpaulin" ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tarpItemsIdIdx" ON "tarpaulinItem" ("tarpId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tarpItemsCategoryIdx" ON "tarpaulinItem" ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tarpItemsDepartmentIdx" ON "tarpaulinItem" ("departmentId");