ALTER TABLE "vehicle_listings"
  ADD COLUMN IF NOT EXISTS "seats" integer,
  ADD COLUMN IF NOT EXISTS "fuel" text,
  ADD COLUMN IF NOT EXISTS "body" text,
  ADD COLUMN IF NOT EXISTS "transmission" text;
