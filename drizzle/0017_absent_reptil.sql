CREATE TABLE IF NOT EXISTS "indentItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"indentId" integer NOT NULL,
	"indentedQty" integer NOT NULL,
	"approvedQty" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "indents" (
	"id" serial PRIMARY KEY NOT NULL,
	"indentNumber" varchar(30) NOT NULL,
	"departmentId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "indents_indentNumber_unique" UNIQUE("indentNumber")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "indentItems" ADD CONSTRAINT "indentItems_indentId_indents_id_fk" FOREIGN KEY ("indentId") REFERENCES "indents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "indentItems" ADD CONSTRAINT "indentItems_indentId_tableList_id_fk" FOREIGN KEY ("indentId") REFERENCES "tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "indents" ADD CONSTRAINT "indents_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "indents" ADD CONSTRAINT "indents_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
