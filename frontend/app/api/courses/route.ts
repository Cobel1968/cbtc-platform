import { NextResponse } from 'next/server';

const courses = [
  { 
    id: 'demo-1', 
    title: 'Entrepreneuriat 101', 
    description: 'Les fondamentaux pour transformer une vision en empire entrepreneurial', 
    price: 0, 
    published: true,
    level: 'Débutant',
    duration: '4 semaines',
    instructor: 'Abel Coulibaly',
    enrolled: 245
  },
  { 
    id: 'demo-2', 
    title: 'Stratégie & Croissance Explosive', 
    description: 'Maîtriser la vision stratégique et l\'exécution pour une croissance durable', 
    price: 99, 
    published: true,
    level: 'Intermédiaire',
    duration: '6 semaines',
    instructor: 'Expert CBTC',
    enrolled: 128
  }
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 200));
  return NextResponse.json(courses.filter(c => c.published));
}
