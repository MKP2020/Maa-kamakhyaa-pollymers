CREATE TABLE IF NOT EXISTS "washingUnit" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"note" text DEFAULT '',
	"shift" varchar(1) NOT NULL,
	"bhusaQuantity" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "washingUnitItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"unitId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"inventoryId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"reqQty" integer NOT NULL,
	"issueQuantity" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "consumptionShiftIdx" ON "washingUnit" ("shift");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "consumptionDateIdx" ON "washingUnit" ("date");