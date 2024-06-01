ALTER TABLE "tapePlant" RENAME COLUMN "tapeGrade" TO "tapeGradeId";--> statement-breakpoint
ALTER TABLE "tapePlant" DROP CONSTRAINT "tapePlant_tapeGrade_grades_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "tapePlantGradeIdx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tapePlant" ADD CONSTRAINT "tapePlant_tapeGradeId_grades_id_fk" FOREIGN KEY ("tapeGradeId") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tapePlantGradeIdx" ON "tapePlant" ("tapeGradeId");