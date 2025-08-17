import { NextResponse } from 'next/server';

const coursesDetails = {
  'demo-1': {
    id: 'demo-1',
    title: 'Entrepreneuriat 101',
    description: 'Les fondamentaux pour transformer une vision en empire entrepreneurial',
    price: 0,
    level: 'Débutant',
    duration: '4 semaines',
    instructor: 'Abel Coulibaly',
    modules: [
      'Vision Entrepreneuriale & Identification d\'Opportunités',
      'Modèle d\'Affaires & Proposition de Valeur',
      'Validation Marché & Customer Discovery',
      'Lancement Stratégique & Premières Ventes'
    ],
    enrolled: 245,
    rating: 4.9,
    testimonials: [
      { name: 'Marie D.', comment: 'Formation transformatrice, merci Abel !' },
      { name: 'Jean-Paul M.', comment: 'Approche concrète et inspirante' }
    ]
  },
  'demo-2': {
    id: 'demo-2',
    title: 'Stratégie & Croissance Explosive',
    description: 'Maîtriser la vision stratégique, KPIs et exécution pour une croissance durable',
    price: 99,
    level: 'Intermédiaire',
    duration: '6 semaines',
    instructor: 'Expert CBTC',
    modules: [
      'Analyse Stratégique Approfondie',
      'KPIs & Métriques de Performance Avancées',
      'Scaling Operations & Optimisation Processus',
      'Innovation Continue & Adaptation Marché'
    ],
    enrolled: 128,
    rating: 4.8,
    testimonials: [
      { name: 'Sophie L.', comment: 'Méthodes éprouvées et résultats concrets' }
    ]
  }
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const course = coursesDetails[params.id as keyof typeof coursesDetails] || {
    id: params.id,
    title: 'Formation en Développement',
    description: 'Contenu exclusif en préparation par nos experts CBTC',
    price: 0,
    level: 'Tous niveaux',
    duration: 'À définir',
    instructor: 'Équipe CBTC',
    modules: ['Module d\'introduction', 'Contenu avancé à venir'],
    enrolled: 0,
    rating: 0,
    testimonials: []
  };
  
  return NextResponse.json(course);
}
