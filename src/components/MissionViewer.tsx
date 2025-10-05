import { useState, useEffect } from 'react';
import { ArrowLeft, Loader, Star, AlertCircle } from 'lucide-react';
import { nasaAPI } from '../lib/nasa';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Mission } from '../lib/supabase';

type MissionViewerProps = {
  mission: Mission;
  onBack: () => void;
};

export function MissionViewer({ mission, onBack }: MissionViewerProps) {
  const { profile, refreshProfile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadMissionData();
  }, [mission.mission_key]);

  const loadMissionData = async () => {
    setLoading(true);
    setError('');

    try {
      let result;
      switch (mission.mission_key) {
        case 'apod':
          result = await nasaAPI.getAPOD();
          break;
        case 'neows':
          result = await nasaAPI.getNeoWs();
          break;
        case 'eonet':
          result = await nasaAPI.getEONET();
          break;
        case 'donki':
          result = await nasaAPI.getDONKI();
          break;
        case 'epic':
          result = await nasaAPI.getEPIC();
          break;
        case 'exoplanet':
          result = await nasaAPI.getExoplanets(10);
          break;
        case 'techport':
          result = await nasaAPI.getTechport();
          break;
        case 'techtransfer':
          result = await nasaAPI.getTechTransfer();
          break;
        case 'mars':
          result = await nasaAPI.getMarsRoverPhotos();
          break;
        default:
          throw new Error('Unknown mission');
      }
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load mission data');
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async () => {
    if (!profile || completing) return;

    setCompleting(true);
    try {
      const existingMission = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', profile.id)
        .eq('mission_id', mission.id)
        .maybeSingle();

      if (existingMission.data) {
        await supabase
          .from('user_missions')
          .update({
            times_completed: existingMission.data.times_completed + 1,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingMission.data.id);
      } else {
        await supabase.from('user_missions').insert({
          user_id: profile.id,
          mission_id: mission.id,
          completed_at: new Date().toISOString(),
          times_completed: 1
        });

        const badgeRes = await supabase
          .from('badges')
          .select('id')
          .eq('mission_key', mission.mission_key)
          .maybeSingle();

        if (badgeRes.data) {
          await supabase.from('user_badges').insert({
            user_id: profile.id,
            badge_id: badgeRes.data.id,
            earned_at: new Date().toISOString()
          }).then(() => {}).catch(() => {});
        }

        await supabase
          .from('profiles')
          .update({
            points: (profile.points || 0) + mission.reward_points
          })
          .eq('id', profile.id);
      }

      await refreshProfile();
      onBack();
    } catch (err) {
      console.error('Error completing mission:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading mission data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/50 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Mission Error</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <button
            onClick={completeMission}
            disabled={completing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            <Star className="w-5 h-5" />
            {completing ? 'Completing...' : `Complete Mission (+${mission.reward_points} pts)`}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{mission.name}</h1>
          <p className="text-blue-200 text-lg">{mission.description}</p>
        </div>

        {renderMissionContent(mission.mission_key, data)}
      </div>
    </div>
  );
}

function renderMissionContent(missionKey: string, data: any) {
  switch (missionKey) {
    case 'apod':
      return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <img src={data.url} alt={data.title} className="w-full h-96 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
            <p className="text-blue-200 mb-4">{data.date}</p>
            <p className="text-white leading-relaxed">{data.explanation}</p>
          </div>
        </div>
      );

    case 'neows':
      const neoCount = data.element_count || 0;
      return (
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Near-Earth Objects: {neoCount} detected
            </h2>
            <p className="text-blue-200">
              Tracking asteroids and comets that pass close to Earth's orbit
            </p>
          </div>
          {Object.values(data.near_earth_objects || {}).flat().slice(0, 10).map((neo: any) => (
            <div key={neo.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{neo.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-300">Diameter</p>
                  <p className="text-white font-semibold">
                    {neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(0) || 'Unknown'} m
                  </p>
                </div>
                <div>
                  <p className="text-blue-300">Potentially Hazardous</p>
                  <p className="text-white font-semibold">
                    {neo.is_potentially_hazardous_asteroid ? 'Yes ⚠️' : 'No ✓'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'eonet':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.events.slice(0, 12).map((event: any) => (
            <div key={event.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
              <p className="text-blue-200 text-sm mb-2">{event.categories[0]?.title || 'Event'}</p>
              {event.geometry && event.geometry[0] && (
                <p className="text-xs text-blue-300">
                  {event.geometry[0].coordinates[1].toFixed(2)}°, {event.geometry[0].coordinates[0].toFixed(2)}°
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case 'donki':
      return (
        <div className="space-y-4">
          {data.slice(0, 10).map((notification: any, index: number) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30">
              <div className="flex items-start gap-4">
                <div className="text-3xl">☀️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{notification.messageType}</h3>
                  <p className="text-blue-200 text-sm">{notification.messageBody}</p>
                  <p className="text-xs text-blue-300 mt-2">{notification.messageIssueTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'epic':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.slice(0, 9).map((image: any) => (
            <div key={image.identifier} className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
              <img
                src={nasaAPI.getEPICImageUrl(image)}
                alt={`Earth ${image.date}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-white text-sm">{image.date}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'exoplanet':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((planet: any, index: number) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🪐</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">{planet.pl_name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-300">Mass</span>
                      <span className="text-white font-semibold">
                        {planet.pl_masse ? `${planet.pl_masse.toFixed(2)} Earth masses` : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">Radius</span>
                      <span className="text-white font-semibold">
                        {planet.pl_rade ? `${planet.pl_rade.toFixed(2)} Earth radii` : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">Distance</span>
                      <span className="text-white font-semibold">
                        {planet.st_dist ? `${planet.st_dist.toFixed(2)} parsecs` : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'techport':
      const projects = data.projects?.slice(0, 12) || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project: any) => (
            <div key={project.projectId} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🚀</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{project.title || `Project ${project.projectId}`}</h3>
                  <p className="text-blue-200 text-sm">NASA Technology Project</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'techtransfer':
      const patents = data.results?.slice(0, 12) || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patents.map((patent: any, index: number) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{patent[2] || 'NASA Innovation'}</h3>
                  <p className="text-blue-200 text-sm">{patent[3] || 'Patent and Technology Transfer'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'mars':
      const photos = data.photos?.slice(0, 12) || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo: any) => (
            <div key={photo.id} className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-red-500/30">
              <img
                src={photo.img_src}
                alt={`Mars ${photo.camera.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-white font-semibold">{photo.camera.full_name}</p>
                <p className="text-blue-200 text-sm">Sol {photo.sol}</p>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <p className="text-white">Mission data loaded successfully</p>
        </div>
      );
  }
}
