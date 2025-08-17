import { NextResponse } from 'next/server';

const courses = [
  { 
    id: 'demo-1', 
    title: 'Entrepreneuriat 101', 
    description: 'Les fondamentaux pour transformer une vision en empire', 
    price: 0, 
    published: true,
    level: 'Débutant',
    duration: '4 semaines',
    instructor: 'Abel Coulibaly'
  },
  { 
    id: 'demo-2', 
    title: 'Stratégie & Croissance', 
    description: 'Vision stratégique et exécution pour la croissance', 
    price: 99, 
    published: true,
    level: 'Intermédiaire',
    duration: '6 semaines',
    instructor: 'Expert CBTC'
  }
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return NextResponse.json(courses.filter(c => c.published));
}
