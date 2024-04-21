ALTER TABLE "venders" RENAME TO "vendors";--> statement-breakpoint
ALTER TABLE "vendors" DROP CONSTRAINT "venders_emailId_unique";--> statement-breakpoint
ALTER TABLE "vendors" DROP CONSTRAINT "venders_categoryId_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "vendors" DROP CONSTRAINT "venders_addressId_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "vendors" DROP CONSTRAINT "venders_bankDerailsId_bankDetails_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendors" ADD CONSTRAINT "vendors_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendors" ADD CONSTRAINT "vendors_addressId_addresses_id_fk" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendors" ADD CONSTRAINT "vendors_bankDerailsId_bankDetails_id_fk" FOREIGN KEY ("bankDerailsId") REFERENCES "bankDetails"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN IF EXISTS "venderId";--> statement-breakpoint
ALTER TABLE "bankDetails" DROP COLUMN IF EXISTS "venderId";--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_emailId_unique" UNIQUE("emailId");