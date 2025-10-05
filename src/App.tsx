import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { CupolaMode } from './components/CupolaMode';
import { NBLMode } from './components/NBLMode';
import { MissionViewer } from './components/MissionViewer';
import { Leaderboard } from './components/Leaderboard';
import { Mission } from './lib/supabase';

type View = 'dashboard' | 'cupola' | 'nbl' | 'mission' | 'leaderboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleViewChange = (view: View, data?: any) => {
    setCurrentView(view);
    if (view === 'mission' && data) {
      setSelectedMission(data);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedMission(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mb-4"></div>
          <p className="text-white text-xl">Initializing Space Academy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  switch (currentView) {
    case 'cupola':
      return <CupolaMode onBack={handleBackToDashboard} />;

    case 'nbl':
      return <NBLMode onBack={handleBackToDashboard} />;

    case 'mission':
      return selectedMission ? (
        <MissionViewer mission={selectedMission} onBack={handleBackToDashboard} />
      ) : (
        <Dashboard onViewChange={handleViewChange} />
      );

    case 'leaderboard':
      return <Leaderboard onBack={handleBackToDashboard} />;

    default:
      return <Dashboard onViewChange={handleViewChange} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
