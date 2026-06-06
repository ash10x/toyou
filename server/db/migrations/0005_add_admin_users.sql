CREATE TABLE IF NOT EXISTS admin_users (
  id         SERIAL PRIMARY KEY,
  username   TEXT NOT NULL UNIQUE,
  email      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
