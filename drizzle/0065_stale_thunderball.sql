ALTER TABLE "purchaseOrders" RENAME COLUMN "taxPercentage" TO "sgst";--> statement-breakpoint
ALTER TABLE "purchaseOrders" ALTER COLUMN "sgst" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "purchaseOrders" ALTER COLUMN "sgst" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "purchaseOrders" ADD COLUMN "igst" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "purchaseOrders" ADD COLUMN "cgst" integer DEFAULT 0;