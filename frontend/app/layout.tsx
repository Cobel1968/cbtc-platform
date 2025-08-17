import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://app.cobelbtc.com'),
  title: 'CBTC - Excellence Entrepreneuriale',
  description: "Plateforme d'apprentissage pour entrepreneurs visionnaires",
  openGraph: {
    title: 'CBTC - Excellence Entrepreneuriale',
    description: "Plateforme d'apprentissage pour entrepreneurs visionnaires",
    url: 'https://app.cobelbtc.com',
    siteName: 'CBTC',
    images: ['/logo-cbtc-social.png'],
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo-cbtc.svg', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/logo-cbtc.png' }], // optionnel, à ajouter dans public si souhaité
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/logo-cbtc.svg" />
        <link rel="apple-touch-icon" href="/logo-cbtc.png" />
        <meta name="theme-color" content="#0b3d91" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <Header />
        <main id="main" className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        {/*
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2025 CBTC - Cobel Business Training Center. Tous droits réservés.</p>
            <p className="text-gray-400 mt-2">Excellence entrepreneuriale par Abel Coulibaly</p>
          </div>
        </footer>
        */}
      </body>
    </html>
  )
}
