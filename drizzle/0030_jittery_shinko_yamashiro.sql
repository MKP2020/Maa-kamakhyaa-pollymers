CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"itemName" text NOT NULL,
	"departmentId" integer NOT NULL,
	"inStockQuantity" integer NOT NULL,
	"usedQuantity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
