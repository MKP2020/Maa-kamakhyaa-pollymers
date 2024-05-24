CREATE INDEX IF NOT EXISTS "inventoryItemName" ON "inventory" ("itemName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventoryDate" ON "inventory" ("createdAt");