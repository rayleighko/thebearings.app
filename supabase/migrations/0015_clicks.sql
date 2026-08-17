-- =============================================================================
-- 0015 — affiliate click log for go.thebearings.app
-- Server-only writes (service role). No public read.
-- Concept content stays in src/data/concepts.ts — not in DB.
-- =============================================================================

CREATE TABLE IF NOT EXISTS clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    slug TEXT NOT NULL,
    concept TEXT,
    sub_id TEXT,
    referrer TEXT,
    user_agent TEXT,
    country TEXT
);

CREATE INDEX IF NOT EXISTS idx_clicks_slug_created_at
  ON clicks (slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clicks_created_at
  ON clicks (created_at DESC);

ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
-- No policies by design — anon/authenticated clients are denied; clicks
-- are written only server-side via the service-role key (createAdminClient).
