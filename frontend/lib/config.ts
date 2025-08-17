export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  price: number;
  thumbnail: string;
}

export const demoCourses: Course[] = [
  {
    id: 'demo-1',
    slug: 'demo-1',
    title: 'CBTC — Introduction au Trading Crypto',
    description: 'Découvrez les fondamentaux du trading de cryptomonnaies avec une approche professionnelle et sécurisée.',
    duration: '2h30',
    level: 'Débutant',
    price: 99,
    thumbnail: 'https://picsum.photos/seed/demo-1/400/300'
  },
  {
    id: 'demo-2',
    slug: 'demo-2',
    title: 'CBTC — Analyse Technique Avancée',
    description: 'Maîtrisez les outils d\'analyse technique et les stratégies de trading pour maximiser vos performances.',
    duration: '4h15',
    level: 'Intermédiaire',
    price: 199,
    thumbnail: 'https://picsum.photos/seed/demo-2/400/300'
  }
];

export function findCourseByIdOrSlug(identifier: string): Course | undefined {
  return demoCourses.find(course => course.id === identifier || course.slug === identifier);
}
