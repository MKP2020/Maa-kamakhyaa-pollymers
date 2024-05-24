CREATE TABLE IF NOT EXISTS "grnItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"grnId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grnNumbers" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"currentCount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grn" (
	"id" serial PRIMARY KEY NOT NULL,
	"grnNumber" varchar(30) NOT NULL,
	"poId" integer NOT NULL,
	"receivedDate" timestamp DEFAULT now() NOT NULL,
	"invoiceNumber" text NOT NULL,
	"invoiceDate" timestamp DEFAULT now() NOT NULL,
	"transportMode" varchar(15) NOT NULL,
	"transportName" text NOT NULL,
	"cnNumber" varchar(30) NOT NULL,
	"vehicleNumber" varchar(30) NOT NULL,
	"freightAmount" integer NOT NULL,
	"taxType" varchar(10) NOT NULL,
	"taxPercentage" integer NOT NULL,
	CONSTRAINT "grn_grnNumber_unique" UNIQUE("grnNumber")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grnItems" ADD CONSTRAINT "grnItems_grnId_grn_id_fk" FOREIGN KEY ("grnId") REFERENCES "public"."grn"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grnItems" ADD CONSTRAINT "grnItems_itemId_purchaseOrderItems_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."purchaseOrderItems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
