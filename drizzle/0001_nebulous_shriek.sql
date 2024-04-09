DO $$ BEGIN
 ALTER TABLE "venders" ADD CONSTRAINT "venders_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venders" ADD CONSTRAINT "venders_addressId_addresses_id_fk" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venders" ADD CONSTRAINT "venders_bankDerailsId_bankDetails_id_fk" FOREIGN KEY ("bankDerailsId") REFERENCES "bankDetails"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
