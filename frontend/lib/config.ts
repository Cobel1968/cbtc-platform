// CBTC Platform Configuration
// Environment and API Configuration

/**
 * Application Configuration
 * Centralized configuration for the CBTC platform frontend
 */
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    timeout: 30000,
    retries: 3,
  },
  
  // Application Settings
  app: {
    name: 'CBTC Platform',
    description: 'Excellence Entrepreneuriale & Formation IELTS',
    version: '1.0.0',
    author: 'Abel Coulibaly',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'app.cobelbtc.com',
  },
  
  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
  
  // Features
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.NEXT_PUBLIC_DEBUG === 'true',
    enableMockData: process.env.NEXT_PUBLIC_MOCK_DATA === 'true',
  }
} as const;

// Export API URL for backward compatibility
export const API_URL = config.api.baseUrl;

// Course Interface
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
