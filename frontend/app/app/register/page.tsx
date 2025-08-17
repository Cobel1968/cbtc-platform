'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/config';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('🚀 Création de votre compte d\'excellence...');
    
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data?.error || 'Erreur inscription');
      }
      
      setMsg('✅ ' + data.message + ' Redirection vers connexion...');
      
      // Redirection vers connexion avec pré-remplissage
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      }, 2000);
      
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
            Rejoindre CBTC
          </h1>
          <p className="text-gray-600 mt-2">Commencez votre parcours d'excellence</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
            <input 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="Votre prénom" 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          
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
              placeholder="Minimum 6 caractères" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
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
            {loading ? 'Création en cours...' : 'Créer mon compte'}
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
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ? 
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
