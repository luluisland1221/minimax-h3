DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM "payment" WHERE "subscription_id" IS NOT NULL GROUP BY "subscription_id" HAVING COUNT(*) > 1) THEN
		RAISE EXCEPTION 'Cannot apply security migration: duplicate payment.subscription_id values exist';
	END IF;
	IF EXISTS (SELECT 1 FROM "payment" WHERE "session_id" IS NOT NULL GROUP BY "session_id" HAVING COUNT(*) > 1) THEN
		RAISE EXCEPTION 'Cannot apply security migration: duplicate payment.session_id values exist';
	END IF;
	IF EXISTS (SELECT 1 FROM "user_credit" GROUP BY "user_id" HAVING COUNT(*) > 1) THEN
		RAISE EXCEPTION 'Cannot apply security migration: duplicate user_credit.user_id values exist';
	END IF;
	IF EXISTS (SELECT 1 FROM "credit_transaction" WHERE "payment_id" IS NOT NULL GROUP BY "payment_id" HAVING COUNT(*) > 1) THEN
		RAISE EXCEPTION 'Cannot apply security migration: duplicate credit_transaction.payment_id values exist';
	END IF;
	IF EXISTS (SELECT 1 FROM "user_credit" WHERE "current_credits" < 0) THEN
		RAISE EXCEPTION 'Cannot apply security migration: negative user_credit.current_credits values exist';
	END IF;
	IF EXISTS (SELECT 1 FROM "credit_transaction" WHERE "remaining_amount" < 0) THEN
		RAISE EXCEPTION 'Cannot apply security migration: negative credit_transaction.remaining_amount values exist';
	END IF;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_webhook_event" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
DROP INDEX IF EXISTS "payment_subscription_id_idx";
--> statement-breakpoint
CREATE UNIQUE INDEX "payment_subscription_id_idx" ON "payment" USING btree ("subscription_id");
--> statement-breakpoint
DROP INDEX IF EXISTS "payment_session_id_idx";
--> statement-breakpoint
CREATE UNIQUE INDEX "payment_session_id_idx" ON "payment" USING btree ("session_id");
--> statement-breakpoint
DROP INDEX IF EXISTS "user_credit_user_id_idx";
--> statement-breakpoint
CREATE UNIQUE INDEX "user_credit_user_id_idx" ON "user_credit" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "credit_transaction_payment_id_idx" ON "credit_transaction" USING btree ("payment_id");
--> statement-breakpoint
ALTER TABLE "user_credit" ADD CONSTRAINT "user_credit_nonnegative" CHECK ("user_credit"."current_credits" >= 0);
--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_remaining_nonnegative" CHECK ("credit_transaction"."remaining_amount" IS NULL OR "credit_transaction"."remaining_amount" >= 0);
