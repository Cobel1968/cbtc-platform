export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎓 CBTC
            </h1>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Excellence Entrepreneuriale
            </h2>
            <p className="text-gray-600 text-sm">
              Connexion à votre plateforme mondiale
            </p>
          </div>

          <form className="space-y-6" autoComplete="on">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email" // ← AMÉLIORATION UX AJOUTÉE
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password" // ← AMÉLIORATION UX AJOUTÉE
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
            >
              🚀 Se connecter à CBTC
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium text-center mb-2">
              💡 Compte de Démonstration
            </p>
            <div className="text-xs text-blue-600 text-center space-y-1">
              <p><strong>Email:</strong> abel.coulibaly@cbtc.com</p>
              <p><strong>Mot de passe:</strong> excellence2024</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
              ← Retour à l'accueil
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              🌍 Plateforme CBTC - Accessible Mondialement 24/7
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
