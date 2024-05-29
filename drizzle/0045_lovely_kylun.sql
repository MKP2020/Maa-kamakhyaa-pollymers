CREATE TABLE IF NOT EXISTS "quantity" (
	"id" serial PRIMARY KEY NOT NULL,
	"producedQty" integer DEFAULT 0,
	"usedQty" integer DEFAULT 0
);
