-- Portal user accounts (renters and hosters)
CREATE TABLE IF NOT EXISTS "portal_users" (
  "id" serial PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "phone" text,
  "role" text NOT NULL DEFAULT 'renter',
  "avatar_url" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Link vehicle listings to portal user accounts
ALTER TABLE "vehicle_listings"
  ADD COLUMN IF NOT EXISTS "user_id" integer REFERENCES "portal_users"("id") ON DELETE SET NULL;
