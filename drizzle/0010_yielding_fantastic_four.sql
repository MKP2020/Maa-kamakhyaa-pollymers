ALTER TABLE "vendors" RENAME COLUMN "bankDerailsId" TO "bankDetailsId";--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_gstNumber_unique";--> statement-breakpoint
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_bankDerailsId_bankDetails_id_fk";
--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "gstNumber" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "pan" varchar(10) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendors" ADD CONSTRAINT "vendors_bankDetailsId_bankDetails_id_fk" FOREIGN KEY ("bankDetailsId") REFERENCES "bankDetails"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN IF EXISTS "gstNumber";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN IF EXISTS "pan";--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_gstNumber_unique" UNIQUE("gstNumber");