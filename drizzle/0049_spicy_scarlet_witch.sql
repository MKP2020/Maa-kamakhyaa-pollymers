ALTER TABLE "rp" ALTER COLUMN "consumedQty" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "producedQty" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "quantity" ALTER COLUMN "usedQty" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "rp" ADD COLUMN "loomQty" integer;--> statement-breakpoint
ALTER TABLE "rp" ADD COLUMN "lamQty" integer;--> statement-breakpoint
ALTER TABLE "rp" ADD COLUMN "tapeQty" integer;--> statement-breakpoint
ALTER TABLE "rp" ADD COLUMN "tarpQty" integer;