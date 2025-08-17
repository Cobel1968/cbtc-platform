import { NextResponse } from 'next/server';

const courses = [
  { 
    id: 'demo-1', 
    title: 'Entrepreneuriat 101', 
    description: 'Les fondamentaux pour transformer une idée en empire', 
    price: 0, 
    published: true,
    level: 'Débutant',
    duration: '4 semaines'
  },
  { 
    id: 'demo-2', 
    title: 'Stratégie & Croissance', 
    description: 'Vision stratégique, KPI et exécution pour la croissance explosive', 
    price: 99, 
    published: true,
    level: 'Intermédiaire',
    duration: '6 semaines'
  },
  { 
    id: 'demo-3', 
    title: 'Leadership Transformationnel', 
    description: 'Développer un leadership qui inspire et transforme les équipes', 
    price: 149, 
    published: true,
    level: 'Avancé',
    duration: '8 semaines'
  }
];

export async function GET() {
  // Simulation d'un léger délai pour l'authenticité
  await new Promise(resolve => setTimeout(resolve, 100));
  return NextResponse.json(courses);
}
