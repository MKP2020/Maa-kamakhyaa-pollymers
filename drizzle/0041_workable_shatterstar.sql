DO $$ BEGIN
 ALTER TABLE "washingUnitItems" ADD CONSTRAINT "washingUnitItems_unitId_washingUnit_id_fk" FOREIGN KEY ("unitId") REFERENCES "public"."washingUnit"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
