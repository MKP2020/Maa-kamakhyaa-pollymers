ALTER TABLE "fabrics" ALTER COLUMN "grade" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fabrics" ADD CONSTRAINT "fabrics_grade_unique" UNIQUE("grade");