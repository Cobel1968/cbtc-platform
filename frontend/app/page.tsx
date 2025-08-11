import Logo from '@/components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur <span className="text-indigo-600">CBTC</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plateforme d'excellence entrepreneuriale qui transforme vos visions en réalités numériques
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              🚀 Programmes d'Excellence
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos programmes de formation conçus pour les entrepreneurs visionnaires
            </p>
            <a 
              href="/programs" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explorer les Programmes
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              👤 Votre Parcours
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre compte et commencez votre transformation entrepreneuriale
            </p>
            <div className="space-y-3">
              <a 
                href="/register" 
                className="block text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                S'inscrire
              </a>
              <a 
                href="/login" 
                className="block text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500">
            🌟 L'avenir de l'éducation entrepreneuriale commence ici
          </p>
        </div>
      </div>
    </div>
  )
}
