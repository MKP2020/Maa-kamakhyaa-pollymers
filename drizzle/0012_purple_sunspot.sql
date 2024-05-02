CREATE TABLE IF NOT EXISTS "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fabrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"grade" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tableList" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryId" integer NOT NULL,
	"name" text NOT NULL,
	"minQuantity" integer NOT NULL,
	"unit" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tableList" ADD CONSTRAINT "tableList_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
