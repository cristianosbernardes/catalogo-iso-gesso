'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBranding } from '@/hooks/useBranding'
import { useFavoritos } from '@/hooks/useFavoritos'
import {
  Package, Phone, Heart, Menu, X, Search, LogIn, Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const branding = useBranding('site')
  const { count: favCount } = useFavoritos()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  // Derive prefix from pathname — SiteLayout is outside CatalogProvider
  const prefix = pathname.startsWith('/pi') ? '/pi' : '/p'
  const isInternal = pathname.startsWith('/pi')

  const navItems = [
    { label: 'Início', href: `${prefix}`, icon: Home },
    { label: 'Produtos', href: `${prefix}/produtos`, icon: Package },
    { label: 'Favoritos', href: `${prefix}/favoritos`, icon: Heart },
    { label: 'Contato', href: `${prefix}/contato`, icon: Phone },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`${prefix}/produtos?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href={prefix}
              className="flex items-center gap-2.5 shrink-0 bg-[#FFF100] rounded-xl px-3 py-1.5"
            >
              <img
                src="/logo-isogesso.svg"
                alt="ISO-GESSO"
                className="h-8 w-auto"
              />
              <span className="font-extrabold tracking-tight text-lg leading-none" style={{ color: '#006DAA' }}>
                ISO-GESSO
              </span>
            </Link>

            {/* Desktop: Search + Nav */}
            <div className="hidden md:flex items-center gap-1">
              <form onSubmit={handleSearch} className="relative mr-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-52 rounded-lg border border-border bg-muted/40 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
                />
              </form>
              <nav className="flex items-center gap-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const isFav = item.label === 'Favoritos'
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'text-muted-foreground border-border hover:text-foreground hover:bg-accent/30 hover:border-accent'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      {isFav && favCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                          {favCount > 99 ? '99+' : favCount}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border py-3 space-y-1"
            >
              {navItems.map((item) => {
                const isFav = item.label === 'Favoritos'
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {isFav && favCount > 0 && (
                      <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                        {favCount > 99 ? '99+' : favCount}
                      </span>
                    )}
                  </Link>
                )
              })}
              <form onSubmit={handleSearch} className="relative px-3 pt-2">
                <Search className="absolute left-6 top-1/2 translate-y-[-25%] h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
                />
              </form>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center gap-2 bg-[#FFF100] rounded-xl px-2.5 py-1">
                  <img src="/logo-isogesso.svg" alt="ISO-GESSO" className="h-6 w-auto" />
                  <span className="font-extrabold tracking-tight text-base leading-none" style={{ color: '#006DAA' }}>
                    ISO-GESSO
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Soluções em isolamento acústico e materiais de alta performance para construção civil.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Navegação</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`${prefix}/produtos`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href={`${prefix}/contato`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href={`${prefix}/favoritos`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Favoritos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`${prefix}/privacidade`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href={`${prefix}/termos`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Termos de Serviço
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Administrativo</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://app.isogesso.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Login do Painel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} {branding.appName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
