import { FavoritosClient } from '@/components/favoritos-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favoritos',
  description: 'Seus produtos favoritos salvos localmente.',
}

export default function FavoritosPage() {
  return <FavoritosClient />
}
