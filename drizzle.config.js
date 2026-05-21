require("dotenv").config();

const url = process.env.NEON_DATABASE_URL;
if (!url) {
  throw new Error(
    "NEON_DATABASE_URL is required for drizzle config. Set it in .env or your environment.",
  );
}

module.exports = {
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    url,
  },
};
