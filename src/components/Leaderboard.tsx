import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Award, Star } from 'lucide-react';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type LeaderboardProps = {
  onBack: () => void;
};

export function Leaderboard({ onBack }: LeaderboardProps) {
  const { profile } = useAuth();
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(100);

    if (data) {
      setLeaders(data);
    }
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (index === 1) return <Medal className="w-8 h-8 text-gray-300" />;
    if (index === 2) return <Award className="w-8 h-8 text-amber-600" />;
    return <Star className="w-6 h-6 text-blue-400" />;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-500/30 to-amber-500/30 border-yellow-500/50';
    if (index === 1) return 'from-gray-400/30 to-gray-500/30 border-gray-400/50';
    if (index === 2) return 'from-amber-600/30 to-orange-600/30 border-amber-600/50';
    return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Global Leaderboard</h1>
          <p className="text-blue-200">Top astronauts across the universe</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
            <p className="text-white mt-4">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => {
              const isCurrentUser = profile?.id === leader.id;

              return (
                <div
                  key={leader.id}
                  className={`bg-gradient-to-r ${getRankColor(index)} backdrop-blur-lg rounded-xl p-4 md:p-6 border transition-all ${
                    isCurrentUser ? 'ring-2 ring-cyan-400 scale-105' : 'hover:scale-102'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 flex items-center justify-center">
                      {index < 3 ? (
                        getRankIcon(index)
                      ) : (
                        <span className="text-2xl font-bold text-white">#{index + 1}</span>
                      )}
                    </div>

                    <div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: leader.avatar_suit_color }}
                    >
                      <span className="text-2xl">👨‍🚀</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white truncate flex items-center gap-2">
                        {leader.username}
                        {isCurrentUser && (
                          <span className="text-xs bg-cyan-500 px-2 py-1 rounded-full">You</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-200">
                          Streak: {leader.current_streak} days
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        {leader.points.toLocaleString()}
                      </div>
                      <div className="text-xs md:text-sm text-blue-200">points</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && leaders.length === 0 && (
          <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <p className="text-white text-lg">No astronauts on the leaderboard yet.</p>
            <p className="text-blue-200 mt-2">Be the first to earn points!</p>
          </div>
        )}
      </div>
    </div>
  );
}
