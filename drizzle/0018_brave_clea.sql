ALTER TABLE "indentItems" DROP CONSTRAINT "indentItems_indentId_tableList_id_fk";
--> statement-breakpoint
ALTER TABLE "indentItems" ALTER COLUMN "approvedQty" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "indentItems" ADD COLUMN "itemId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "indentItems" ADD CONSTRAINT "indentItems_itemId_tableList_id_fk" FOREIGN KEY ("itemId") REFERENCES "tableList"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
