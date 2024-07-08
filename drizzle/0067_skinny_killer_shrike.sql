ALTER TABLE "grn" RENAME COLUMN "taxPercentage" TO "sgst";--> statement-breakpoint
ALTER TABLE "grn" ALTER COLUMN "sgst" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "grn" ALTER COLUMN "sgst" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "grn" ADD COLUMN "igst" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "grn" ADD COLUMN "cgst" integer DEFAULT 0;