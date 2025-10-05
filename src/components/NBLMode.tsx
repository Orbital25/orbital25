import { useState, useEffect } from 'react';
import { ArrowLeft, Droplets, Check, Wrench, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type NBLModeProps = {
  onBack: () => void;
};

type Stage = 'intro' | 'buoyancy' | 'hatch' | 'spacewalk' | 'tools' | 'lunar' | 'complete';

export function NBLMode({ onBack }: NBLModeProps) {
  const { profile, refreshProfile } = useAuth();
  const [stage, setStage] = useState<Stage>('intro');
  const [buoyancy, setBuoyancy] = useState(50);
  const [astronautPosition, setAstronautPosition] = useState(0);
  const [collectedTools, setCollectedTools] = useState<number[]>([]);
  const [lunarSamples, setLunarSamples] = useState<number[]>([]);

  const completeBuoyancy = () => {
    if (Math.abs(buoyancy - 50) < 10) {
      setStage('hatch');
      saveProgress('buoyancy');
    }
  };

  const saveProgress = async (stageName: string) => {
    if (!profile) return;

    await supabase
      .from('nbl_progress')
      .upsert({
        user_id: profile.id,
        stage: stageName,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,stage'
      });
  };

  const completeTraining = async () => {
    if (!profile) return;

    const missionRes = await supabase
      .from('missions')
      .select('id, reward_points')
      .eq('mission_key', 'nbl_complete')
      .maybeSingle();

    if (missionRes.data) {
      await supabase.from('user_missions').insert({
        user_id: profile.id,
        mission_id: missionRes.data.id,
        completed_at: new Date().toISOString(),
        times_completed: 1
      });

      const badgeRes = await supabase
        .from('badges')
        .select('id')
        .eq('mission_key', 'nbl_complete')
        .maybeSingle();

      if (badgeRes.data) {
        await supabase.from('user_badges').insert({
          user_id: profile.id,
          badge_id: badgeRes.data.id,
          earned_at: new Date().toISOString()
        });
      }

      await supabase
        .from('profiles')
        .update({
          points: (profile.points || 0) + missionRes.data.reward_points
        })
        .eq('id', profile.id);

      await refreshProfile();
    }

    setStage('complete');
  };

  useEffect(() => {
    if (stage === 'spacewalk' && astronautPosition >= 100) {
      setStage('tools');
      saveProgress('spacewalk');
    }
  }, [astronautPosition, stage]);

  useEffect(() => {
    if (stage === 'tools' && collectedTools.length >= 4) {
      setStage('lunar');
      saveProgress('tools');
    }
  }, [collectedTools, stage]);

  useEffect(() => {
    if (stage === 'lunar' && lunarSamples.length >= 3) {
      (async () => {
        await saveProgress('lunar');
        await completeTraining(); // eslint-disable-line react-hooks/exhaustive-deps
      })();
    }
  }, [lunarSamples, stage]);

  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit NBL
        </button>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6 mx-auto">
              <Droplets className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 text-center">
              Neutral Buoyancy Laboratory
            </h1>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              Welcome to the Sonny Carter Training Facility. You're about to experience what real astronauts go through
              in underwater training. The NBL is a massive pool that simulates the weightlessness of space.
            </p>
            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl p-4 mb-6">
              <h3 className="text-cyan-300 font-bold mb-2">Training Sequence:</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm">1</div>
                  Adjust your buoyancy weights
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm">2</div>
                  Open the airlock hatch
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm">3</div>
                  Navigate using handrails
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm">4</div>
                  Collect tethered tools
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm">5</div>
                  Lunar surface exploration
                </li>
              </ul>
            </div>
            <button
              onClick={() => setStage('buoyancy')}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
            >
              Begin Training
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'buoyancy') {
    const isCalibrated = Math.abs(buoyancy - 50) < 10;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(59,130,246,0.1)_20px,rgba(59,130,246,0.1)_40px)] animate-pulse"></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Buoyancy Calibration
            </h2>
            <p className="text-blue-100 mb-8 text-center">
              Adjust the weights to achieve neutral buoyancy (target: 45-55)
            </p>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-200">Weight Distribution</span>
                <span className={`font-bold text-2xl ${isCalibrated ? 'text-green-400' : 'text-white'}`}>
                  {buoyancy}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={buoyancy}
                onChange={(e) => setBuoyancy(Number(e.target.value))}
                className="w-full h-3 bg-blue-900/50 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-blue-300 mt-2">
                <span>Too Light</span>
                <span>Perfect</span>
                <span>Too Heavy</span>
              </div>
            </div>

            {isCalibrated && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 animate-pulse">
                <div className="flex items-center gap-2 text-green-300">
                  <Check className="w-5 h-5" />
                  <span className="font-bold">Buoyancy Calibrated!</span>
                </div>
              </div>
            )}

            <button
              onClick={completeBuoyancy}
              disabled={!isCalibrated}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalibrated ? 'Proceed to Airlock' : 'Calibration Required'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'hatch') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-xl w-full text-center">
            <div className="mb-8 animate-pulse">
              <div className="w-64 h-64 mx-auto rounded-full border-8 border-cyan-500 relative">
                <div className="absolute inset-4 rounded-full border-4 border-cyan-400"></div>
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-900/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white text-6xl font-bold">◉</div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Opening Airlock Hatch</h2>
            <p className="text-blue-200 mb-8">Decompression sequence initiated...</p>
            <button
              onClick={() => {
                setStage('spacewalk');
                saveProgress('hatch');
              }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
            >
              Enter Pool
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'spacewalk') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-cyan-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Spacewalk Navigation</h2>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
              <div className="mb-6">
                <div className="flex justify-between text-blue-200 mb-2">
                  <span>Progress</span>
                  <span>{astronautPosition}%</span>
                </div>
                <div className="w-full h-4 bg-blue-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${astronautPosition}%` }}
                  />
                </div>
              </div>

              <p className="text-blue-100 mb-6 text-center">
                Use the handrails to navigate through the underwater mockup of the ISS
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setAstronautPosition(Math.max(0, astronautPosition - 10))}
                  className="flex-1 py-3 bg-blue-500/30 hover:bg-blue-500/50 text-white font-bold rounded-lg transition-all border border-blue-500"
                >
                  ← Move Left
                </button>
                <button
                  onClick={() => setAstronautPosition(Math.min(100, astronautPosition + 10))}
                  className="flex-1 py-3 bg-blue-500/30 hover:bg-blue-500/50 text-white font-bold rounded-lg transition-all border border-blue-500"
                >
                  Move Right →
                </button>
              </div>
            </div>

            {astronautPosition >= 100 && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center animate-pulse">
                <p className="text-green-300 font-bold">Navigation complete! Proceeding to tool collection...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'tools') {
    const tools = ['Wrench', 'Screwdriver', 'Drill', 'Tether'];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-blue-900 to-slate-800 relative overflow-hidden">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Tool Collection</h2>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
              <p className="text-blue-100 mb-6 text-center">
                Collect all tethered tools ({collectedTools.length}/4)
              </p>

              <div className="grid grid-cols-2 gap-4">
                {tools.map((tool, index) => {
                  const isCollected = collectedTools.includes(index);

                  return (
                    <button
                      key={index}
                      onClick={() => !isCollected && setCollectedTools([...collectedTools, index])}
                      disabled={isCollected}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        isCollected
                          ? 'bg-green-500/20 border-green-500 opacity-50'
                          : 'bg-blue-500/20 border-cyan-500 hover:bg-blue-500/30'
                      }`}
                    >
                      <Wrench className={`w-12 h-12 mx-auto mb-2 ${isCollected ? 'text-green-400' : 'text-cyan-400'}`} />
                      <p className="text-white font-bold">{tool}</p>
                      {isCollected && <Check className="w-6 h-6 text-green-400 mx-auto mt-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {collectedTools.length >= 4 && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center animate-pulse">
                <p className="text-green-300 font-bold">All tools collected! Proceeding to lunar simulation...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'lunar') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit NBL
        </button>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
              <Moon className="w-10 h-10 text-yellow-400" />
              Lunar Surface Exploration
            </h2>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
              <p className="text-blue-100 mb-6 text-center">
                Collect rock samples from the pool floor ({lunarSamples.length}/3)
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[0, 1, 2].map((index) => {
                  const isCollected = lunarSamples.includes(index);

                  return (
                    <button
                      key={index}
                      onClick={() => !isCollected && setLunarSamples([...lunarSamples, index])}
                      disabled={isCollected}
                      className={`aspect-square rounded-xl border-2 transition-all transform hover:scale-110 flex items-center justify-center ${
                        isCollected
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-slate-700/50 border-slate-500 hover:border-yellow-500'
                      }`}
                    >
                      {isCollected ? (
                        <Check className="w-8 h-8 text-green-400" />
                      ) : (
                        <div className="text-4xl">🌑</div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center">
                <p className="text-yellow-200 text-sm">
                  The pool floor simulates lunar gravity and terrain
                </p>
              </div>
            </div>

            {lunarSamples.length >= 3 && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center animate-pulse">
                <p className="text-green-300 font-bold">Mission complete! Processing certification...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-cyan-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-6 animate-bounce">👨‍🚀</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Congratulations!
            </h1>
            <p className="text-2xl text-cyan-300 mb-6">
              You are now a Certified Spacewalker
            </p>
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 mb-8">
              <p className="text-green-300 text-lg mb-2">Training Complete</p>
              <p className="text-white font-bold text-3xl">+500 Points</p>
            </div>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
