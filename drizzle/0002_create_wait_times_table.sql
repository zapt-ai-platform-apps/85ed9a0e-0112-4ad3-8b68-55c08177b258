CREATE TABLE IF NOT EXISTS "wait_times" (
  "id" SERIAL PRIMARY KEY,
  "bar_id" INTEGER NOT NULL REFERENCES "bars"("id") ON DELETE CASCADE,
  "wait_minutes" INTEGER NOT NULL,
  "reporter_ip" VARCHAR(45),
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "wait_times_bar_id_idx" ON "wait_times" ("bar_id");
CREATE INDEX IF NOT EXISTS "wait_times_created_at_idx" ON "wait_times" ("created_at");