import { findCourseByIdOrSlug } from '@/lib/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props { 
  params: { id: string } 
}

export default function CourseDetailPage({ params }: Props) {
  const course = findCourseByIdOrSlug(params.id);
  if (!course) notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
          ← Retour aux formations
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{course.description}</p>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Contenu de la formation</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Introduction aux cryptomonnaies et blockchain</li>
                <li>• Analyse fondamentale et technique</li>
                <li>• Stratégies de trading et gestion des risques</li>
                <li>• Psychologie du trader et discipline</li>
                <li>• Outils et plateformes de trading</li>
                <li>• Fiscalité et aspects légaux</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{course.price}€</div>
              <p className="text-sm text-gray-500">Formation complète</p>
            </div>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span>Niveau</span>
                <span className="font-semibold text-blue-600">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Durée</span>
                <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Accès</span>
                <span className="font-semibold">À vie</span>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
              S'inscrire maintenant
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Garantie satisfait ou remboursé 30 jours
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
