'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('🔐 Connexion à votre espace d\'excellence...');
    
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data?.error || 'Erreur de connexion');
      }
      
      setMsg('✅ ' + data.message + ' Redirection...');
      
      // Redirection intelligente selon le rôle
      setTimeout(() => {
        if (data.user?.role === 'admin') {
          router.push('/admin');
        } else if (data.user?.role === 'instructor') {
          router.push('/instructor/dashboard');
        } else {
          router.push('/courses');
        }
      }, 1500);
      
    } catch (err: any) {
      setMsg('❌ ' + (err.message || 'Erreur réseau - Réessayez'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connexion CBTC
          </h1>
          <p className="text-gray-600 mt-2">Accédez à votre espace d'excellence</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="votre@email.com" 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
            <input 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="Votre mot de passe" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all transform ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105'
            }`}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        {msg && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${
            msg.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : msg.includes('❌')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {msg}
          </div>
        )}
        
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Pas encore de compte ? 
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
              Rejoindre CBTC
            </a>
          </p>
          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Démo : utilisez n'importe quel email/mot de passe valide
          </p>
        </div>
      </div>
    </main>
  );
}
