'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">⚡ Administration CBTC</h1>
        <p className="text-xl text-gray-600">Tableau de bord administrateur - Abel Coulibaly</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Financial Management */}
        <Link href="/admin/finances" className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion Financière</h3>
            <p className="text-gray-600 mb-4">
              Paiements Wave, POS, rapports comptables
            </p>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Système Complet
            </div>
          </div>
        </Link>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion Utilisateurs</h3>
            <p className="text-gray-600 mb-4">
              Étudiants, instructeurs, inscriptions
            </p>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              En Développement
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion Formations</h3>
            <p className="text-gray-600 mb-4">
              Programmes, leçons, contenu
            </p>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              En Développement
            </div>
          </div>
        </div>

        {/* IELTS Management */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tests IELTS</h3>
            <p className="text-gray-600 mb-4">
              Examens, résultats, analytics
            </p>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Base de Données Prête
            </div>
          </div>
        </div>

        {/* AI Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyse IA</h3>
            <p className="text-gray-600 mb-4">
              Intelligence artificielle, analytics
            </p>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Service Actif
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Paramètres Système</h3>
            <p className="text-gray-600 mb-4">
              Configuration, sécurité, maintenance
            </p>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              Configuration
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">📊 Statistiques Rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm opacity-90">Utilisateurs Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm opacity-90">Formations Publiées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">340K</div>
            <div className="text-sm opacity-90">XOF ce mois</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm opacity-90">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-8 text-center">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-900 mb-2">🏢 CBTC Platform - Direction</h3>
          <p className="text-gray-600">
            📞 <strong>+2250555007884</strong> | ✉️ <strong>abel@cobelbtc.com</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Directeur: Abel Coulibaly | Excellence Entrepreneuriale & IELTS
          </p>
        </div>
      </div>
    </main>
  );
}
