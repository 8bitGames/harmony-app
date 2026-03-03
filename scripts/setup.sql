-- ============================================
-- Harmony App - Complete Database Schema
-- Supabase SQL Editor에서 실행
-- ============================================

-- ========== ENUMS ==========

DO $$ BEGIN CREATE TYPE subscription_tier AS ENUM ('free', 'premium'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE verification_type AS ENUM ('real_name', 'face', 'activity', 'review'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE join_type AS ENUM ('open', 'approval'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE member_role AS ENUM ('owner', 'admin', 'member'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE member_status AS ENUM ('active', 'banned'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE post_type AS ENUM ('general', 'notice', 'review', 'photo'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE meeting_participant_status AS ENUM ('joined', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE info_category AS ENUM ('health', 'finance', 'travel', 'hobby', 'gov'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE community_category AS ENUM ('free', 'health', 'travel', 'hobby', 'daily', 'review'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE chat_room_type AS ENUM ('club', 'private', 'open'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE chat_request_status AS ENUM ('pending', 'accepted', 'rejected', 'expired'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE report_target_type AS ENUM ('user', 'post', 'comment', 'chat'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE report_status AS ENUM ('pending', 'processed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE activity_type AS ENUM ('join_club', 'create_meeting', 'join_meeting', 'write_post', 'write_review', 'write_comment'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ========== TABLES ==========

-- Users & Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY, -- Supabase auth user id
  nickname TEXT NOT NULL,
  birth_year INTEGER,
  region TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  photo_urls JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier subscription_tier DEFAULT 'free',
  activity_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hobbies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS user_hobbies (
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  hobby_id TEXT REFERENCES hobbies(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, hobby_id)
);

CREATE TABLE IF NOT EXISTS verification_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  type verification_type NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Places (카카오맵 연동)
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lat TEXT NOT NULL,
  lng TEXT NOT NULL,
  description TEXT,
  is_senior_recommended BOOLEAN DEFAULT FALSE,
  data_source TEXT DEFAULT 'kakao',
  created_by TEXT REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clubs (동호회)
CREATE TABLE IF NOT EXISTS clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_id TEXT REFERENCES profiles(id),
  cover_image TEXT,
  join_type join_type DEFAULT 'open',
  member_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_members (
  club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  role member_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status member_status DEFAULT 'active',
  PRIMARY KEY (club_id, user_id)
);

CREATE TABLE IF NOT EXISTS club_posts (
  id TEXT PRIMARY KEY,
  club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id),
  type post_type DEFAULT 'general',
  content TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_post_likes (
  post_id TEXT REFERENCES club_posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS club_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES club_posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings (정모)
CREATE TABLE IF NOT EXISTS club_meetings (
  id TEXT PRIMARY KEY,
  club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  location_lat TEXT,
  location_lng TEXT,
  place_id TEXT REFERENCES places(id),
  max_participants INTEGER DEFAULT 20,
  current_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meeting_participants (
  meeting_id TEXT REFERENCES club_meetings(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  status meeting_participant_status DEFAULT 'joined',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (meeting_id, user_id)
);

-- Reviews (모임 후기)
CREATE TABLE IF NOT EXISTS meeting_reviews (
  id TEXT PRIMARY KEY,
  meeting_id TEXT REFERENCES club_meetings(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content: Fortune (운세)
CREATE TABLE IF NOT EXISTS fortune_master (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  zodiac TEXT NOT NULL,
  content TEXT NOT NULL,
  health_content TEXT,
  money_content TEXT,
  relation_content TEXT
);

CREATE TABLE IF NOT EXISTS fortune_comments (
  id TEXT PRIMARY KEY,
  fortune_id TEXT REFERENCES fortune_master(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id),
  comment TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content: Info (정보 콘텐츠)
CREATE TABLE IF NOT EXISTS info_contents (
  id TEXT PRIMARY KEY,
  category info_category NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary_box TEXT,
  tags JSONB DEFAULT '[]',
  author TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS info_comments (
  id TEXT PRIMARY KEY,
  content_id TEXT REFERENCES info_contents(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community (커뮤니티)
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  category community_category NOT NULL,
  user_id TEXT REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_likes (
  post_id TEXT REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat (채팅 메타데이터 - 메시지는 Firebase)
CREATE TABLE IF NOT EXISTS chat_rooms (
  id TEXT PRIMARY KEY,
  type chat_room_type NOT NULL,
  name TEXT,
  club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  firebase_room_id TEXT
);

CREATE TABLE IF NOT EXISTS chat_room_members (
  room_id TEXT REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_requests (
  id TEXT PRIMARY KEY,
  from_user TEXT REFERENCES profiles(id),
  to_user TEXT REFERENCES profiles(id),
  status chat_request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Safety (신고/차단)
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT REFERENCES profiles(id),
  target_type report_target_type NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- Subscriptions (구독/결제)
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT DEFAULT 'premium',
  amount TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  auto_renew TEXT DEFAULT 'true',
  payment_key TEXT
);

-- Social (팔로우/활동피드)
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS activity_feed (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type activity_type NOT NULL,
  target_id TEXT NOT NULL,
  target_title TEXT,
  metadata TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push Subscriptions (알림)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier);

-- Clubs
CREATE INDEX IF NOT EXISTS idx_clubs_category ON clubs(category);
CREATE INDEX IF NOT EXISTS idx_clubs_region ON clubs(region);
CREATE INDEX IF NOT EXISTS idx_clubs_owner ON clubs(owner_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members(user_id);
CREATE INDEX IF NOT EXISTS idx_club_posts_club ON club_posts(club_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_club_posts_user ON club_posts(user_id);

-- Meetings
CREATE INDEX IF NOT EXISTS idx_meetings_club ON club_meetings(club_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON club_meetings(date);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user ON meeting_participants(user_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_meeting ON meeting_reviews(meeting_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON meeting_reviews(user_id);

-- Content
CREATE INDEX IF NOT EXISTS idx_info_category ON info_contents(category);
CREATE INDEX IF NOT EXISTS idx_info_created ON info_contents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_region ON community_posts(region);

-- Chat
CREATE INDEX IF NOT EXISTS idx_chat_rooms_club ON chat_rooms(club_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_user ON chat_room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_requests_to ON chat_requests(to_user, status);

-- Social
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);

-- Safety
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_id);

-- Push
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_clubs_search ON clubs USING GIN (to_tsvector('simple', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_info_search ON info_contents USING GIN (to_tsvector('simple', title || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_community_search ON community_posts USING GIN (to_tsvector('simple', title || ' ' || COALESCE(content, '')));

-- Fortune
CREATE INDEX IF NOT EXISTS idx_fortune_date ON fortune_master(date);
CREATE INDEX IF NOT EXISTS idx_fortune_zodiac ON fortune_master(zodiac);

-- ========== RLS (Row Level Security) ==========

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: 누구나 조회, 본인만 수정
CREATE POLICY IF NOT EXISTS "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY IF NOT EXISTS "profiles_update" ON profiles FOR UPDATE USING (auth.uid()::text = id);

-- Hobbies: 누구나 조회
CREATE POLICY IF NOT EXISTS "hobbies_select" ON hobbies FOR SELECT USING (true);

-- User Hobbies: 본인만 관리
CREATE POLICY IF NOT EXISTS "user_hobbies_select" ON user_hobbies FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "user_hobbies_insert" ON user_hobbies FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "user_hobbies_delete" ON user_hobbies FOR DELETE USING (auth.uid()::text = user_id);

-- Clubs: 누구나 조회, 인증 사용자 생성
CREATE POLICY IF NOT EXISTS "clubs_select" ON clubs FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "clubs_insert" ON clubs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY IF NOT EXISTS "clubs_update" ON clubs FOR UPDATE USING (auth.uid()::text = owner_id);

-- Club Members: 누구나 조회, 인증 사용자 참여
CREATE POLICY IF NOT EXISTS "club_members_select" ON club_members FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "club_members_insert" ON club_members FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "club_members_delete" ON club_members FOR DELETE USING (auth.uid()::text = user_id);

-- Club Posts: 동호회 멤버 조회, 본인 게시글 관리
CREATE POLICY IF NOT EXISTS "club_posts_select" ON club_posts FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "club_posts_insert" ON club_posts FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "club_posts_update" ON club_posts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "club_posts_delete" ON club_posts FOR DELETE USING (auth.uid()::text = user_id);

-- Community Posts: 누구나 조회, 인증 사용자 작성
CREATE POLICY IF NOT EXISTS "community_posts_select" ON community_posts FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "community_posts_insert" ON community_posts FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "community_posts_update" ON community_posts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "community_posts_delete" ON community_posts FOR DELETE USING (auth.uid()::text = user_id);

-- Community Comments: 누구나 조회, 본인만 관리
CREATE POLICY IF NOT EXISTS "community_comments_select" ON community_comments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "community_comments_insert" ON community_comments FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "community_comments_delete" ON community_comments FOR DELETE USING (auth.uid()::text = user_id);

-- Community Likes: 인증 사용자 관리
CREATE POLICY IF NOT EXISTS "community_likes_select" ON community_likes FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "community_likes_insert" ON community_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "community_likes_delete" ON community_likes FOR DELETE USING (auth.uid()::text = user_id);

-- Info Contents: 누구나 조회
CREATE POLICY IF NOT EXISTS "info_contents_select" ON info_contents FOR SELECT USING (true);

-- Info Comments: 누구나 조회, 인증 사용자 작성
CREATE POLICY IF NOT EXISTS "info_comments_select" ON info_comments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "info_comments_insert" ON info_comments FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Meetings: 누구나 조회, 인증 사용자 생성
CREATE POLICY IF NOT EXISTS "meetings_select" ON club_meetings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "meetings_insert" ON club_meetings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Meeting Participants
CREATE POLICY IF NOT EXISTS "meeting_participants_select" ON meeting_participants FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "meeting_participants_insert" ON meeting_participants FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "meeting_participants_delete" ON meeting_participants FOR DELETE USING (auth.uid()::text = user_id);

-- Meeting Reviews
CREATE POLICY IF NOT EXISTS "reviews_select" ON meeting_reviews FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "reviews_insert" ON meeting_reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Places: 누구나 조회
CREATE POLICY IF NOT EXISTS "places_select" ON places FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "places_insert" ON places FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Chat: 본인 채팅방만
CREATE POLICY IF NOT EXISTS "chat_rooms_select" ON chat_rooms FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "chat_members_select" ON chat_room_members FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "chat_members_insert" ON chat_room_members FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "chat_requests_select" ON chat_requests FOR SELECT USING (auth.uid()::text = from_user OR auth.uid()::text = to_user);
CREATE POLICY IF NOT EXISTS "chat_requests_insert" ON chat_requests FOR INSERT WITH CHECK (auth.uid()::text = from_user);

-- User Follows
CREATE POLICY IF NOT EXISTS "follows_select" ON user_follows FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "follows_insert" ON user_follows FOR INSERT WITH CHECK (auth.uid()::text = follower_id);
CREATE POLICY IF NOT EXISTS "follows_delete" ON user_follows FOR DELETE USING (auth.uid()::text = follower_id);

-- Activity Feed: 누구나 조회
CREATE POLICY IF NOT EXISTS "activity_select" ON activity_feed FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "activity_insert" ON activity_feed FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Reports: 본인 신고만
CREATE POLICY IF NOT EXISTS "reports_insert" ON reports FOR INSERT WITH CHECK (auth.uid()::text = reporter_id);

-- Blocks: 본인 차단만
CREATE POLICY IF NOT EXISTS "blocks_select" ON blocks FOR SELECT USING (auth.uid()::text = blocker_id);
CREATE POLICY IF NOT EXISTS "blocks_insert" ON blocks FOR INSERT WITH CHECK (auth.uid()::text = blocker_id);
CREATE POLICY IF NOT EXISTS "blocks_delete" ON blocks FOR DELETE USING (auth.uid()::text = blocker_id);

-- Subscriptions: 본인만
CREATE POLICY IF NOT EXISTS "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Verification Badges: 누구나 조회
CREATE POLICY IF NOT EXISTS "badges_select" ON verification_badges FOR SELECT USING (true);

-- Fortune: 누구나 조회
CREATE POLICY IF NOT EXISTS "fortune_select" ON fortune_master FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "fortune_comments_select" ON fortune_comments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "fortune_comments_insert" ON fortune_comments FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Push Subscriptions: 본인만
CREATE POLICY IF NOT EXISTS "push_select" ON push_subscriptions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "push_insert" ON push_subscriptions FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "push_delete" ON push_subscriptions FOR DELETE USING (auth.uid()::text = user_id);

-- ========== Service Role Bypass ==========
-- Note: Supabase service_role key bypasses RLS automatically.
-- API routes using service_role have full access.

-- ============================================
-- Done! All tables, indexes, and RLS policies created.
-- ============================================
