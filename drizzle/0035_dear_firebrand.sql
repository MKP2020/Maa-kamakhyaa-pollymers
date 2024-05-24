CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"itemId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"inStockQuantity" integer NOT NULL,
	"usedQuantity" integer NOT NULL,
	"departmentId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventoryItemIdx" ON "inventory" ("itemId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventoryDate" ON "inventory" ("createdAt");