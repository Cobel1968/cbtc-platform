'use client';

import Link from 'next/link';
import { demoPrograms } from '@/lib/config';

export default function CoursesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎓 Formations CBTC</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez nos programmes d'excellence entrepreneuriale et de formation IELTS
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {demoPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{program.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                  <p className="text-sm text-gray-600">{program.category}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">{program.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-indigo-600">
                    {program.price.toLocaleString()} XOF
                  </span>
                  <div className="text-sm text-gray-500">
                    ⏱️ {program.duration} • 👥 {program.students} étudiants
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Niveau</div>
                  <div className="font-medium text-gray-900">{program.level}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href={`/checkout/${program.id}`}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-center block font-medium"
                >
                  💳 S'inscrire maintenant
                </Link>
                
                <Link
                  href={`/courses/${program.id}`}
                  className="w-full border border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors text-center block font-medium"
                >
                  📖 Voir les détails
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods Info */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">💳 Méthodes de Paiement</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Wave Money</h3>
            <p className="text-gray-600 mb-3">Paiement mobile instantané et sécurisé</p>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600">Numéro CBTC</p>
              <p className="text-lg font-bold text-blue-600">+2250555007884</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">💵</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Paiement Comptoir</h3>
            <p className="text-gray-600 mb-3">Cash avec reçu officiel CBTC</p>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600">Terminaux disponibles</p>
              <p className="text-lg font-bold text-green-600">Abidjan • Cocody • Marcory</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            📞 Support: <strong>+2250555007884</strong> | ✉️ <strong>abel@cobelbtc.com</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
