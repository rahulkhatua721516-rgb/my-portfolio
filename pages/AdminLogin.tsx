
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { View } from '../App';

interface Props {
  onLoginSuccess: () => void;
  onViewChange: (view: View) => void;
}

const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onViewChange }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await storageService.login(password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid passkey. Access denied.');
      }
    } catch (err) {
      setError('Connection failed. Is the backend server running?');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative z-50">
      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent-neon/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent-neon/20">
            <Lock className="accent-neon" size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-gray-500 mt-2 font-bold uppercase text-xs tracking-widest">Enter Secure Passkey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Master Passkey</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-accent-neon transition-all text-center text-xl tracking-widest text-white disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl animate-shake">
              <p className="text-red-500 text-xs font-bold text-center">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent-neon text-black py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(186,255,0,0.2)] outline-none disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Authenticate <ArrowRight size={20} /></>
            )}
          </button>

          <button 
            onClick={() => onViewChange('home')} 
            type="button"
            className="block w-full text-center text-xs text-gray-700 hover:text-accent-neon transition-colors font-bold uppercase mt-8 outline-none"
          >
            Back to Public Website
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
