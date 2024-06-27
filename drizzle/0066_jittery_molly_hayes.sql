ALTER TABLE "users" DROP CONSTRAINT "users_departmentId_departments_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "departmentId";