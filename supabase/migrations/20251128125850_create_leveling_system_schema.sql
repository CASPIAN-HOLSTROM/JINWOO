/*
  # Solo Leveling System - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for a Solo Leveling-style life RPG system
  where users progress through ranks, levels, quests, and earn titles.

  ## New Tables

  ### 1. hunters (users)
  - id (uuid, primary key) - links to auth.users
  - username (text, unique) - display name
  - level (int) - current level (1+)
  - current_xp (int) - XP in current level
  - total_xp (bigint) - lifetime XP
  - rank (text) - E, D, C, B, A, S, SS, SSS
  - current_streak (int) - consecutive days
  - longest_streak (int) - record streak
  - hunter_class (text) - Warrior, Assassin, Mage, Shadow Monarch
  - penalty_mode (boolean) - activated on missed days
  - created_at (timestamptz)
  - last_active (timestamptz)

  ### 2. hunter_stats
  - id (uuid, primary key)
  - hunter_id (uuid, foreign key)
  - strength (int)
  - intelligence (int)
  - willpower (int)
  - discipline (int)
  - endurance (int)

  ### 3. hunter_goals
  - id (uuid, primary key)
  - hunter_id (uuid, foreign key)
  - primary_goal (text) - main objective
  - skillset (text[]) - skills to build
  - daily_availability (int) - hours per day
  - weaknesses (text[])
  - long_term_mission (text)

  ### 4. titles
  - id (uuid, primary key)
  - name (text, unique) - title name
  - description (text)
  - category (text) - Ascension, Shadow, Grinding, etc.
  - unlock_requirement (jsonb) - conditions to unlock
  - image_path (text)
  - rarity (text) - Common, Rare, Epic, Legendary, Mythic

  ### 5. hunter_titles
  - id (uuid, primary key)
  - hunter_id (uuid, foreign key)
  - title_id (uuid, foreign key)
  - unlocked_at (timestamptz)
  - is_active (boolean) - currently displayed

  ### 6. quests
  - id (uuid, primary key)
  - hunter_id (uuid, foreign key)
  - quest_type (text) - Daily, Boss, Raid, Optional
  - category (text) - Business, Skill, Physical, Mind
  - title (text)
  - description (text)
  - xp_reward (int)
  - difficulty (int) - scales with level
  - status (text) - Active, Completed, Failed, Expired
  - due_date (timestamptz)
  - completed_at (timestamptz)
  - created_at (timestamptz)

  ### 7. level_milestones
  - level (int, primary key)
  - xp_required (int) - cumulative XP to reach this level
  - rank_unlock (text) - rank unlocked at this level
  - image_path (text) - ascension artwork

  ### 8. rank_data
  - rank (text, primary key)
  - min_level (int)
  - image_path (text)
  - description (text)

  ### 9. ascension_log
  - id (uuid, primary key)
  - hunter_id (uuid, foreign key)
  - event_type (text) - Level, Rank, Title
  - from_value (text)
  - to_value (text)
  - timestamp (timestamptz)
  - image_shown (text)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated access required for all operations
*/

-- Create hunters table (extends auth.users)
CREATE TABLE IF NOT EXISTS hunters (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  level int DEFAULT 1 CHECK (level >= 1),
  current_xp int DEFAULT 0 CHECK (current_xp >= 0),
  total_xp bigint DEFAULT 0 CHECK (total_xp >= 0),
  rank text DEFAULT 'E' CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS')),
  current_streak int DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak int DEFAULT 0 CHECK (longest_streak >= 0),
  hunter_class text CHECK (hunter_class IN ('Warrior', 'Assassin', 'Mage', 'Shadow Monarch')),
  penalty_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

-- Create hunter_stats table
CREATE TABLE IF NOT EXISTS hunter_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id uuid UNIQUE NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  strength int DEFAULT 10 CHECK (strength >= 0),
  intelligence int DEFAULT 10 CHECK (intelligence >= 0),
  willpower int DEFAULT 10 CHECK (willpower >= 0),
  discipline int DEFAULT 10 CHECK (discipline >= 0),
  endurance int DEFAULT 10 CHECK (endurance >= 0)
);

-- Create hunter_goals table
CREATE TABLE IF NOT EXISTS hunter_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id uuid UNIQUE NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  primary_goal text NOT NULL,
  skillset text[] DEFAULT '{}',
  daily_availability int DEFAULT 8 CHECK (daily_availability >= 1 AND daily_availability <= 24),
  weaknesses text[] DEFAULT '{}',
  long_term_mission text
);

-- Create titles table
CREATE TABLE IF NOT EXISTS titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('Ascension', 'Shadow', 'Grinding', 'Business', 'Discipline', 'War', 'Mythic', 'Insanity', 'Legendary')),
  unlock_requirement jsonb NOT NULL DEFAULT '{}',
  image_path text,
  rarity text DEFAULT 'Common' CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary', 'Mythic'))
);

-- Create hunter_titles junction table
CREATE TABLE IF NOT EXISTS hunter_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id uuid NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  title_id uuid NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT false,
  UNIQUE(hunter_id, title_id)
);

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id uuid NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  quest_type text NOT NULL CHECK (quest_type IN ('Daily', 'Boss', 'Raid', 'Optional')),
  category text NOT NULL CHECK (category IN ('Business', 'Skill', 'Physical', 'Mind')),
  title text NOT NULL,
  description text,
  xp_reward int DEFAULT 100 CHECK (xp_reward >= 0),
  difficulty int DEFAULT 1 CHECK (difficulty >= 1),
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Failed', 'Expired')),
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create level_milestones table
CREATE TABLE IF NOT EXISTS level_milestones (
  level int PRIMARY KEY CHECK (level >= 1),
  xp_required int NOT NULL CHECK (xp_required >= 0),
  rank_unlock text CHECK (rank_unlock IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS')),
  image_path text
);

-- Create rank_data table
CREATE TABLE IF NOT EXISTS rank_data (
  rank text PRIMARY KEY CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS')),
  min_level int NOT NULL,
  image_path text,
  description text
);

-- Create ascension_log table
CREATE TABLE IF NOT EXISTS ascension_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id uuid NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('Level', 'Rank', 'Title')),
  from_value text,
  to_value text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  image_shown text
);

-- Enable Row Level Security
ALTER TABLE hunters ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunter_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunter_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunter_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ascension_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hunters
CREATE POLICY "Users can view own hunter data"
  ON hunters FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own hunter data"
  ON hunters FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own hunter data"
  ON hunters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for hunter_stats
CREATE POLICY "Users can view own stats"
  ON hunter_stats FOR SELECT
  TO authenticated
  USING (hunter_id = auth.uid());

CREATE POLICY "Users can update own stats"
  ON hunter_stats FOR UPDATE
  TO authenticated
  USING (hunter_id = auth.uid())
  WITH CHECK (hunter_id = auth.uid());

CREATE POLICY "Users can insert own stats"
  ON hunter_stats FOR INSERT
  TO authenticated
  WITH CHECK (hunter_id = auth.uid());

-- RLS Policies for hunter_goals
CREATE POLICY "Users can view own goals"
  ON hunter_goals FOR SELECT
  TO authenticated
  USING (hunter_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON hunter_goals FOR UPDATE
  TO authenticated
  USING (hunter_id = auth.uid())
  WITH CHECK (hunter_id = auth.uid());

CREATE POLICY "Users can insert own goals"
  ON hunter_goals FOR INSERT
  TO authenticated
  WITH CHECK (hunter_id = auth.uid());

-- RLS Policies for titles (public read, no write for users)
CREATE POLICY "Anyone can view titles"
  ON titles FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for hunter_titles
CREATE POLICY "Users can view own titles"
  ON hunter_titles FOR SELECT
  TO authenticated
  USING (hunter_id = auth.uid());

CREATE POLICY "Users can update own titles"
  ON hunter_titles FOR UPDATE
  TO authenticated
  USING (hunter_id = auth.uid())
  WITH CHECK (hunter_id = auth.uid());

CREATE POLICY "Users can insert own titles"
  ON hunter_titles FOR INSERT
  TO authenticated
  WITH CHECK (hunter_id = auth.uid());

-- RLS Policies for quests
CREATE POLICY "Users can view own quests"
  ON quests FOR SELECT
  TO authenticated
  USING (hunter_id = auth.uid());

CREATE POLICY "Users can update own quests"
  ON quests FOR UPDATE
  TO authenticated
  USING (hunter_id = auth.uid())
  WITH CHECK (hunter_id = auth.uid());

CREATE POLICY "Users can insert own quests"
  ON quests FOR INSERT
  TO authenticated
  WITH CHECK (hunter_id = auth.uid());

CREATE POLICY "Users can delete own quests"
  ON quests FOR DELETE
  TO authenticated
  USING (hunter_id = auth.uid());

-- RLS Policies for level_milestones (public read)
CREATE POLICY "Anyone can view level milestones"
  ON level_milestones FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for rank_data (public read)
CREATE POLICY "Anyone can view rank data"
  ON rank_data FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for ascension_log
CREATE POLICY "Users can view own ascension log"
  ON ascension_log FOR SELECT
  TO authenticated
  USING (hunter_id = auth.uid());

CREATE POLICY "Users can insert own ascension log"
  ON ascension_log FOR INSERT
  TO authenticated
  WITH CHECK (hunter_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hunters_level ON hunters(level);
CREATE INDEX IF NOT EXISTS idx_hunters_rank ON hunters(rank);
CREATE INDEX IF NOT EXISTS idx_quests_hunter_status ON quests(hunter_id, status);
CREATE INDEX IF NOT EXISTS idx_quests_due_date ON quests(due_date);
CREATE INDEX IF NOT EXISTS idx_hunter_titles_hunter ON hunter_titles(hunter_id);
CREATE INDEX IF NOT EXISTS idx_ascension_log_hunter ON ascension_log(hunter_id, timestamp DESC);