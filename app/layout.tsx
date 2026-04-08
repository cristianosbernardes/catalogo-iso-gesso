import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/lib/query-provider'
import SiteLayout from '@/components/site-layout'
import { DynamicFavicon } from '@/components/dynamic-favicon'
import './globals.css'

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'ISO-GESSO | Catalogo', template: '%s | ISO-GESSO' },
  description: 'Catalogo de produtos acusticos ISO-GESSO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <QueryProvider>
          <DynamicFavicon />
          <SiteLayout>{children}</SiteLayout>
        </QueryProvider>
      </body>
    </html>
  )
}
