CREATE TABLE IF NOT EXISTS "purchaseOrderItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"poId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchaseOrders" (
	"id" serial PRIMARY KEY NOT NULL,
	"indentNumber" varchar(30) NOT NULL,
	"sellerId" integer NOT NULL,
	"indentId" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"taxType" varchar(10) NOT NULL,
	"taxPercentage" integer NOT NULL,
	"approvalStatus" integer DEFAULT 0 NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "purchaseOrders_indentNumber_unique" UNIQUE("indentNumber")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchaseOrderItems" ADD CONSTRAINT "purchaseOrderItems_poId_purchaseOrders_id_fk" FOREIGN KEY ("poId") REFERENCES "purchaseOrders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchaseOrderItems" ADD CONSTRAINT "purchaseOrderItems_itemId_indentItems_id_fk" FOREIGN KEY ("itemId") REFERENCES "indentItems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchaseOrders" ADD CONSTRAINT "purchaseOrders_sellerId_vendors_id_fk" FOREIGN KEY ("sellerId") REFERENCES "vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchaseOrders" ADD CONSTRAINT "purchaseOrders_indentId_indents_id_fk" FOREIGN KEY ("indentId") REFERENCES "indents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
