export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenue sur CBTC
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          La plateforme d'excellence entrepreneuriale pour apprendre, enseigner et prospérer. 
          Où les visionnaires d'aujourd'hui forgent les empires de demain.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Apprendre</h3>
          <p className="text-gray-600">Formations d'excellence conçues par des entrepreneurs accomplis</p>
        </div>
        
        <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Enseigner</h3>
          <p className="text-gray-600">Partagez votre expertise et inspirez la nouvelle génération</p>
        </div>
        
        <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Prospérer</h3>
          <p className="text-gray-600">Construisez votre empire entrepreneurial avec confiance</p>
        </div>
      </div>
      
      <div className="text-center mt-16">
        <a href="/courses" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
          Découvrir nos formations
        </a>
      </div>
    </main>
  );
}
