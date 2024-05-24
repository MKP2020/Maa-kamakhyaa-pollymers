ALTER TABLE "inventory" RENAME COLUMN "itemName" TO "itemId";--> statement-breakpoint
DROP INDEX IF EXISTS "inventoryItemName";--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "itemId" SET DATA TYPE integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "itemCategoryIdx" ON "tableList" ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventoryItemIdx" ON "inventory" ("itemId");