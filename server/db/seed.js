const { getClient } = require("../db/client");
const bcrypt = require("bcryptjs");

async function seed() {
  const client = await getClient();

  // create an admin user (password: admin123)
  const hash = bcrypt.hashSync("admin123", 10);
  await client.query(
    `INSERT INTO users (name, email, password_hash, is_admin) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
    ["Admin", "admin@toyou.local", hash, true],
  );

  // sample locations
  const locations = [
    "Kingston",
    "Montego Bay",
    "Ocho Rios",
    "Negril",
    "Mandeville",
    "Airport Pickup",
  ];
  for (const l of locations) {
    await client.query(
      `INSERT INTO locations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [l],
    );
  }

  // sample cars (minimal)
  await client.query(
    `INSERT INTO cars (name, image, price, seats, fuel, body, transmission, featured) VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
    ["BMW X6", "/cars/bmw-x6.jpg", 120, 5, "Petrol", "SUV", "Automatic", true],
  );

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
