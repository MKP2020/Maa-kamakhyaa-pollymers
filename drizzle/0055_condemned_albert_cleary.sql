ALTER TABLE "quantity" ADD COLUMN "gradeId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quantity" ADD CONSTRAINT "quantity_gradeId_grades_id_fk" FOREIGN KEY ("gradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
