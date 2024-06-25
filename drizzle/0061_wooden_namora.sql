DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('used', 'produced');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quantity-for" (
	"id" serial PRIMARY KEY NOT NULL,
	"for" integer NOT NULL,
	"type" "type" NOT NULL,
	"usedQty" bigint DEFAULT 0 NOT NULL,
	"gradeId" integer
);
--> statement-breakpoint
ALTER TABLE "purchaseOrders" ALTER COLUMN "approvalStatus" SET DEFAULT 2;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quantity-for" ADD CONSTRAINT "quantity-for_gradeId_grades_id_fk" FOREIGN KEY ("gradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
