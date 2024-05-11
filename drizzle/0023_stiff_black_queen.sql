ALTER TABLE "purchaseOrders" RENAME COLUMN "indentNumber" TO "poNumber";--> statement-breakpoint
ALTER TABLE "purchaseOrders" DROP CONSTRAINT "purchaseOrders_indentNumber_unique";--> statement-breakpoint
ALTER TABLE "purchaseOrders" ADD CONSTRAINT "purchaseOrders_poNumber_unique" UNIQUE("poNumber");