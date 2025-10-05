import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ProfileEditorProps = {
  onBack: () => void;
};

export function ProfileEditor({ onBack }: ProfileEditorProps) {
  const { profile, updateProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || '');
  const [suitColor, setSuitColor] = useState(profile?.avatar_suit_color || '#4A90E2');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateProfile({ username, avatar_suit_color: suitColor });
    setLoading(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition-all border border-white/30 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-6">Edit Profile</h1>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Astronaut Name</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Suit Color</label>
              <input type="color" value={suitColor} onChange={(e) => setSuitColor(e.target.value)} className="w-full h-12 p-1 bg-white/10 border border-white/20 rounded-lg" />
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg transition-all disabled:opacity-50">
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}