import { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Camera, AlertTriangle, Sun, Sunrise } from 'lucide-react';
import { nasaAPI } from '../lib/nasa';

type CupolaModeProps = {
  onBack: () => void;
};

type EONETEvent = {
  id: string;
  title: string;
  categories: { title: string }[];
  geometry: { coordinates: [number, number] }[];
};

export function CupolaMode({ onBack }: CupolaModeProps) {
  const [view, setView] = useState<'main' | 'apod' | 'epic' | 'eonet'>('main');
  const [apodData, setApodData] = useState<any>(null);
  const [epicImages, setEpicImages] = useState<any[]>([]);
  const [eonetEvents, setEonetEvents] = useState<EONETEvent[]>([]);
  const [currentEpicIndex, setCurrentEpicIndex] = useState(0);
  const [sunsetPhase, setSunsetPhase] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSunsetPhase((prev) => (prev + 1) % 8);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Effect to animate the EPIC images for a spinning Earth effect
  useEffect(() => {
    if (view === 'epic' && epicImages.length > 0) {
      const epicInterval = setInterval(() => {
        setCurrentEpicIndex((prevIndex) => (prevIndex + 1) % epicImages.length);
      }, 2000); // Change image every 2 seconds

      return () => clearInterval(epicInterval);
    }
  }, [view, epicImages]);

  const loadAPOD = async () => {
    setLoading(true);
    try {
      const data = await nasaAPI.getAPOD();
      setApodData(data);
      setView('apod');
    } catch (error) {
      console.error('Error loading APOD:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEPIC = async () => {
    setLoading(true);
    try {
      const data = await nasaAPI.getEPIC();
      setEpicImages(data.slice(0, 10));
      setView('epic');
    } catch (error) {
      console.error('Error loading EPIC:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEONET = async () => {
    setLoading(true);
    try {
      const data = await nasaAPI.getEONET();
      setEonetEvents(data.events.slice(0, 20));
      setView('eonet');
    } catch (error) {
      console.error('Error loading EONET:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSunsetGradient = (phase: number) => {
    const gradients = [
      'from-blue-900 via-blue-800 to-blue-900',
      'from-orange-900 via-red-800 to-blue-900',
      'from-yellow-600 via-orange-700 to-blue-900',
      'from-pink-600 via-purple-700 to-blue-900',
      'from-blue-900 via-indigo-800 to-slate-900',
      'from-slate-900 via-blue-900 to-slate-800',
      'from-blue-900 via-cyan-800 to-blue-900',
      'from-cyan-600 via-blue-700 to-blue-900',
    ];
    return gradients[phase];
  };

  const getEventIcon = (category: string) => {
    if (category.includes('Fire')) return '🔥';
    if (category.includes('Storm')) return '⛈️';
    if (category.includes('Volcano')) return '🌋';
    if (category.includes('Flood')) return '🌊';
    return '⚠️';
  };

  if (view === 'apod' && apodData) {
    return (
      <div className="min-h-screen bg-black relative">
        <button
          onClick={() => setView('main')}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cupola
        </button>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <img
              src={apodData.url}
              alt={apodData.title}
              className="w-full rounded-2xl shadow-2xl mb-6"
            />
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-2">{apodData.title}</h2>
              <p className="text-blue-200 mb-4">{apodData.date}</p>
              <p className="text-white leading-relaxed">{apodData.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'epic' && epicImages.length > 0) {
    const currentImage = epicImages[currentEpicIndex];

    return (
      <div className="min-h-screen bg-black relative">
        <button
          onClick={() => setView('main')}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cupola
        </button>

        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <img
            src={nasaAPI.getEPICImageUrl(currentImage)}
            alt="Earth from EPIC"
            key={currentImage.identifier}
            className="max-w-3xl w-full rounded-full shadow-2xl mb-6 aspect-square object-cover animate-fade-in"
          />
          <div className="flex gap-2 mb-4">
            {epicImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEpicIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentEpicIndex ? 'bg-cyan-400 w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20">
            <p className="text-white font-semibold">{currentImage.date}</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'eonet' && eonetEvents.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 relative">
        <button
          onClick={() => setView('main')}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cupola
        </button>

        <div className="max-w-6xl mx-auto p-8 pt-20">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <Globe className="w-10 h-10 text-cyan-400" />
            Global Events Monitor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eonetEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-red-500/50 transition-all"
              >
                <div className="text-3xl mb-2">
                  {getEventIcon(event.categories[0]?.title || '')}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                <p className="text-sm text-blue-200">
                  {event.categories[0]?.title || 'Natural Event'}
                </p>
                {event.geometry && event.geometry[0] && (
                  <p className="text-xs text-blue-300 mt-2">
                    Location: {event.geometry[0].coordinates[1].toFixed(2)}°, {event.geometry[0].coordinates[0].toFixed(2)}°
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getSunsetGradient(sunsetPhase)} relative transition-all duration-[3000ms]`}>
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30"
      >
        <ArrowLeft className="w-5 h-5" />
        Exit Cupola
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-full blur-3xl"></div>
          <div className="w-96 h-96 rounded-full border-8 border-white/20 backdrop-blur-sm relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-blue-900/40"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-32 h-32 text-white/30 animate-pulse" />
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 text-white text-sm mb-2">
                  <Sunrise className="w-4 h-4 text-yellow-400" />
                  <span>ISS Sunrise/Sunset Cycle {sunsetPhase + 1}/16</span>
                </div>
                <p className="text-xs text-blue-200">The ISS experiences 16 sunrises and sunsets every 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-4 max-w-4xl px-4">
        <button
          onClick={loadAPOD}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30 disabled:opacity-50"
        >
          <Sun className="w-5 h-5" />
          Astronomy Picture
        </button>

        <button
          onClick={loadEPIC}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30 disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
          Earth Images
        </button>

        <button
          onClick={loadEONET}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30 disabled:opacity-50"
        >
          <AlertTriangle className="w-5 h-5" />
          Global Events
        </button>
      </div>
    </div>
  );
}
