CREATE TABLE "business_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"hours" text,
	"facebook_url" text,
	"instagram_url" text,
	"twitter_url" text,
	"maps_embed_url" text
);

-- Seed default row
INSERT INTO "business_info" ("id", "phone", "email", "address", "hours", "facebook_url", "instagram_url", "twitter_url", "maps_embed_url")
VALUES (
	1,
	'+1 (876) 000-0000',
	'info@toyourentals.com',
	'Kingston, Jamaica',
	'Mon - Sun | 24/7 Support',
	NULL,
	NULL,
	NULL,
	'https://maps.google.com/maps?q=Kingston%20Jamaica&t=&z=13&ie=UTF8&iwloc=&output=embed'
)
ON CONFLICT (id) DO NOTHING;
