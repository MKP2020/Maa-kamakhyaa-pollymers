CREATE TABLE IF NOT EXISTS "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"addressLine1" text NOT NULL,
	"addressLine2" text,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"state" text NOT NULL,
	"pinCode" varchar(12) NOT NULL,
	"gstNumber" text NOT NULL,
	"pan" varchar(10) NOT NULL,
	"venderId" integer NOT NULL,
	CONSTRAINT "addresses_gstNumber_unique" UNIQUE("gstNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bankDetails" (
	"id" serial PRIMARY KEY NOT NULL,
	"accountNumber" text NOT NULL,
	"ifsc" text NOT NULL,
	"branch" text NOT NULL,
	"venderId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"venderId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contactNumber" varchar(12) NOT NULL,
	"emailId" text NOT NULL,
	"categoryId" integer NOT NULL,
	"addressId" integer NOT NULL,
	"bankDerailsId" integer NOT NULL,
	CONSTRAINT "venders_emailId_unique" UNIQUE("emailId")
);
