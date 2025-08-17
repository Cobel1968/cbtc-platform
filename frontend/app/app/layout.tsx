import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: { default: 'CBTC - Excellence Entrepreneuriale', template: '%s | CBTC' },
  description: "Plateforme d'excellence entrepreneuriale pour apprendre, enseigner et prospérer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CBTC
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Accueil</Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">Formations</Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">Administration</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Connexion</Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                S'inscrire
              </Link>
            </div>
          </nav>
        </header>
        
        <div className="min-h-screen bg-white">
          {children}
        </div>
        
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 CBTC - Plateforme d'Excellence Entrepreneuriale</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
