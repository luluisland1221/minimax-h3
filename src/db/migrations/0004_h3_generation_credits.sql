ALTER TABLE "video_generation" ADD COLUMN "credits_reserved" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "video_generation" ADD COLUMN "credits_charged" integer;--> statement-breakpoint
ALTER TABLE "video_generation" ADD COLUMN "credits_settled_at" timestamp;
