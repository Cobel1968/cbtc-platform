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
    images: ['/logo-cbtc.svg'],
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo-cbtc.svg', type: 'image/svg+xml' }
    ],
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
        <link rel="icon" href="/logo-cbtc.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0b3d91" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  )
}
