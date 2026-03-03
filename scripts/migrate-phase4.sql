-- Phase 4 Database Migration: Social Features
-- Run this after Phase 1-3 migrations

-- Activity type enum
DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM (
    'join_club', 'create_meeting', 'join_meeting',
    'write_post', 'write_review', 'write_comment'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User follows table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Activity feed table
CREATE TABLE IF NOT EXISTS activity_feed (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type activity_type NOT NULL,
  target_id TEXT NOT NULL,
  target_title TEXT,
  metadata TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);

-- Full-text search indexes for search feature
CREATE INDEX IF NOT EXISTS idx_clubs_search ON clubs USING GIN (to_tsvector('simple', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_info_search ON info_contents USING GIN (to_tsvector('simple', title || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_community_search ON community_posts USING GIN (to_tsvector('simple', title || ' ' || COALESCE(content, '')));
