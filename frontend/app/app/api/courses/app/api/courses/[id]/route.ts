import { NextResponse } from 'next/server';

const courses = [
  { 
    id: 'demo-1', 
    title: 'Entrepreneuriat 101', 
    description: 'Les fondamentaux pour transformer une idée en empire', 
    price: 0, 
    published: true,
    level: 'Débutant',
    duration: '4 semaines',
    modules: ['Vision & Opportunités', 'Modèle d\'Affaires', 'Validation Marché', 'Lancement']
  },
  { 
    id: 'demo-2', 
    title: 'Stratégie & Croissance', 
    description: 'Vision stratégique, KPI et exécution pour la croissance explosive', 
    price: 99, 
    published: true,
    level: 'Intermédiaire',
    duration: '6 semaines',
    modules: ['Analyse Stratégique', 'KPIs & Métriques', 'Scaling Operations', 'Innovation Continue']
  }
];

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const course = courses.find(c => c.id === params.id) || {
    id: params.id,
    title: 'Formation Découverte',
    description: 'Contenu exclusif en préparation par nos experts',
    price: 0,
    published: true,
    level: 'Tous niveaux',
    duration: 'À définir',
    modules: ['Module d\'introduction', 'Contenu avancé à venir']
  };
  
  return NextResponse.json(course);
}
