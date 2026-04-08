import { FavoritosClient } from '@/components/favoritos-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favoritos | Interno',
  description: 'Seus produtos favoritos salvos localmente.',
  robots: { index: false, follow: false },
}

export default function FavoritosInternoPage() {
  return <FavoritosClient />
}
