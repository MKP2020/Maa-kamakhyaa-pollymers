ALTER TABLE "departments" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "fabrics" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tableList" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;