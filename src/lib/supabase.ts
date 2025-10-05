import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  avatar_suit_color: string;
  avatar_patch: string;
  points: number;
  current_streak: number;
  last_login_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward_points: number;
  mission_key: string;
};

export type Mission = {
  id: string;
  name: string;
  api_name: string;
  description: string;
  reward_points: number;
  mission_key: string;
  category: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badges?: Badge;
};

export type UserMission = {
  id: string;
  user_id: string;
  mission_id: string;
  completed_at: string;
  times_completed: number;
};

export type NBLProgress = {
  id: string;
  user_id: string;
  stage: string;
  completed: boolean;
  completed_at: string | null;
};
