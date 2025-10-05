import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Telescope, Satellite, Globe, Sun, Camera, Rocket,
  Lightbulb, FileText, Mountain, Trophy, Flame, LogOut,
  User, ChevronRight, Star, Droplets
} from 'lucide-react';
import { supabase, Mission, Badge, UserBadge } from '../lib/supabase';

type View = 'dashboard' | 'cupola' | 'nbl' | 'mission' | 'leaderboard' | 'profile';

type DashboardProps = {
  onViewChange: (view: View, data?: any) => void;
};

export function Dashboard({ onViewChange }: DashboardProps) {
  const { profile, signOut } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;

    const [missionsRes, badgesRes, userBadgesRes, completedRes] = await Promise.all([
      supabase.from('missions').select('*'),
      supabase.from('badges').select('*'),
      supabase.from('user_badges').select('*, badges(*)').eq('user_id', profile.id),
      supabase.from('user_missions').select('mission_id').eq('user_id', profile.id)
    ]);

    if (missionsRes.data) setMissions(missionsRes.data);
    if (badgesRes.data) setBadges(badgesRes.data);
    if (userBadgesRes.data) setUserBadges(userBadgesRes.data);
    if (completedRes.data) {
      setCompletedMissions(new Set(completedRes.data.map(m => m.mission_id)));
    }
  };

  const getMissionIcon = (missionKey: string) => {
    const icons: Record<string, any> = {
      apod: Telescope,
      neows: Mountain,
      eonet: Globe,
      donki: Sun,
      epic: Camera,
      exoplanet: Satellite,
      techport: Rocket,
      techtransfer: Lightbulb,
      mars: Mountain,
      nbl_complete: Droplets
    };
    return icons[missionKey] || Star;
  };

  const earnedBadgeKeys = new Set(
    userBadges.map(ub => (ub.badges as any)?.mission_key).filter(Boolean)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Space Academy</h1>
            <p className="text-blue-200">Mission Control Dashboard</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all border border-red-500/50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: profile?.avatar_suit_color }}>
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{profile?.username}</h3>
                <p className="text-blue-200">Astronaut Trainee</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm mb-1">Total Points</p>
                <p className="text-4xl font-bold text-white">{profile?.points || 0}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">Current Streak</p>
                <p className="text-4xl font-bold text-white">{profile?.current_streak || 0} days</p>
              </div>
              <Flame className="w-12 h-12 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => onViewChange('cupola')}
            className="group bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/50 hover:border-cyan-400 transition-all hover:scale-105 transform"
          >
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-12 h-12 text-cyan-400" />
              <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Cupola Mode</h3>
            <p className="text-blue-200">Observe Earth from the ISS window</p>
          </button>

          <button
            onClick={() => onViewChange('nbl')}
            className="group bg-gradient-to-br from-indigo-500/30 to-blue-500/30 backdrop-blur-lg rounded-2xl p-8 border border-indigo-500/50 hover:border-blue-400 transition-all hover:scale-105 transform"
          >
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-12 h-12 text-blue-400" />
              <ChevronRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">NBL Training</h3>
            <p className="text-blue-200">Underwater spacewalk simulation</p>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-cyan-400" />
            Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.filter(m => m.mission_key !== 'nbl_complete').map((mission) => {
              const Icon = getMissionIcon(mission.mission_key);
              const isCompleted = earnedBadgeKeys.has(mission.mission_key);

              return (
                <button
                  key={mission.id}
                  onClick={() => onViewChange('mission', mission)}
                  className={`group bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all hover:scale-105 text-left ${
                    isCompleted
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-white/20 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`w-8 h-8 ${isCompleted ? 'text-green-400' : 'text-cyan-400'}`} />
                    {isCompleted && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Completed
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{mission.name}</h3>
                  <p className="text-sm text-blue-200 mb-3">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">+{mission.reward_points} pts</span>
                    <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Your Badges ({userBadges.length}/{badges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => {
              const isEarned = earnedBadgeKeys.has(badge.mission_key);

              return (
                <div
                  key={badge.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border text-center transition-all ${
                    isEarned
                      ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                      : 'border-white/20 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="text-sm font-bold text-white mb-1">{badge.name}</h4>
                  <p className="text-xs text-blue-200">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onViewChange('leaderboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 text-white font-bold rounded-lg transition-all border border-purple-500/50"
          >
            <Trophy className="w-5 h-5" />
            View Global Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
