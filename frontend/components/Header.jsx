// frontend/components/Header.jsx
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
        <Link href="/" aria-label="CBTC - Accueil" className="flex items-center">
          <Image src="/logo-cbtc.svg" alt="CBTC Logo" width={180} height={60} priority />
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link href="/register">Inscription</Link>
          <Link href="/login">Connexion</Link>
          <Link href="/courses">Formations</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}


