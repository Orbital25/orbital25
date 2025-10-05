/*
  # Space Academy Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `avatar_suit_color` (text)
      - `avatar_patch` (text)
      - `points` (integer, default 0)
      - `current_streak` (integer, default 0)
      - `last_login_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `badges`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `icon` (text)
      - `reward_points` (integer)
      - `mission_key` (text, unique)
    
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `badge_id` (uuid, references badges)
      - `earned_at` (timestamptz)
    
    - `missions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `api_name` (text)
      - `description` (text)
      - `reward_points` (integer)
      - `mission_key` (text, unique)
      - `category` (text)
    
    - `user_missions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `mission_id` (uuid, references missions)
      - `completed_at` (timestamptz)
      - `times_completed` (integer, default 1)
    
    - `daily_challenges`
      - `id` (uuid, primary key)
      - `mission_id` (uuid, references missions)
      - `challenge_date` (date, unique)
      - `created_at` (timestamptz)
    
    - `nbl_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `stage` (text)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add public read policies for badges and missions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_suit_color text DEFAULT '#4A90E2',
  avatar_patch text DEFAULT 'explorer',
  points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  last_login_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view profiles for leaderboard"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  reward_points integer DEFAULT 0,
  mission_key text UNIQUE NOT NULL
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  api_name text NOT NULL,
  description text NOT NULL,
  reward_points integer DEFAULT 0,
  mission_key text UNIQUE NOT NULL,
  category text DEFAULT 'exploration'
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view missions"
  ON missions FOR SELECT
  TO authenticated
  USING (true);

-- Create user_missions table
CREATE TABLE IF NOT EXISTS user_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  times_completed integer DEFAULT 1
);

ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions"
  ON user_missions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can complete missions"
  ON user_missions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update mission completion"
  ON user_missions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
  challenge_date date UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (true);

-- Create nbl_progress table
CREATE TABLE IF NOT EXISTS nbl_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stage text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, stage)
);

ALTER TABLE nbl_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own NBL progress"
  ON nbl_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own NBL progress"
  ON nbl_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify NBL progress"
  ON nbl_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default badges
INSERT INTO badges (name, description, icon, reward_points, mission_key) VALUES
  ('Sky Watcher', 'View the Astronomy Picture of the Day', '🔭', 100, 'apod'),
  ('Asteroid Analyst', 'Track near-Earth objects', '☄️', 200, 'neows'),
  ('Earth Guardian', 'Monitor global events', '🌍', 150, 'eonet'),
  ('Solar Sentinel', 'Track space weather', '☀️', 150, 'donki'),
  ('Blue Marble Observer', 'Capture real-time Earth photos', '🌎', 50, 'epic'),
  ('Exoplanet Discoverer', 'Explore distant worlds', '🪐', 200, 'exoplanet'),
  ('Tech Innovator', 'Research NASA projects', '🚀', 100, 'techport'),
  ('Inventor', 'Explore NASA patents', '💡', 50, 'techtransfer'),
  ('Martian Scout', 'Explore Mars surface', '🔴', 250, 'mars'),
  ('Certified Spacewalker', 'Complete NBL training simulation', '👨‍🚀', 500, 'nbl_complete')
ON CONFLICT (mission_key) DO NOTHING;

-- Insert missions
INSERT INTO missions (name, api_name, description, reward_points, mission_key, category) VALUES
  ('Cosmic View', 'APOD', 'Explore daily astronomy images from NASA', 100, 'apod', 'astronomy'),
  ('Asteroid Tracker', 'NeoWs', 'Monitor near-Earth asteroids and comets', 200, 'neows', 'planetary'),
  ('Planet Watch', 'EONET', 'Track natural events across Earth', 150, 'eonet', 'earth'),
  ('Solar Storm Monitor', 'DONKI', 'Monitor space weather and solar activity', 150, 'donki', 'space_weather'),
  ('Earth Capture', 'EPIC', 'View real-time images of Earth', 50, 'epic', 'earth'),
  ('Exoplanet Explorer', 'Exoplanet Archive', 'Discover planets beyond our solar system', 200, 'exoplanet', 'planetary'),
  ('Tech Researcher', 'Techport', 'Learn about NASA technology projects', 100, 'techport', 'technology'),
  ('Innovation Access', 'TechTransfer', 'Explore NASA patents and innovations', 50, 'techtransfer', 'technology'),
  ('Mars Recon', 'Mars Rover Photos', 'Explore Mars through rover cameras', 250, 'mars', 'planetary'),
  ('NBL Training', 'Neutral Buoyancy Lab', 'Complete astronaut training simulation', 500, 'nbl_complete', 'training')
ON CONFLICT (mission_key) DO NOTHING;