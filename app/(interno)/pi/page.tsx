import { Suspense } from 'react'
import { api } from '@/lib/api'
import { HomeClient } from '@/components/home-client'
import type { Metadata } from 'next'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'ISO-GESSO | Catálogo Interno',
  description: 'Catálogo interno com preços — acesso restrito à equipe.',
  robots: { index: false, follow: false },
}

export default async function HomeInternoPage() {
  const [populares, categorias, allProdutos] = await Promise.all([
    api.catalogo.populares(8).catch(() => []),
    api.categorias.listar().catch(() => []),
    api.catalogo.listar().catch(() => []),
  ])

  return (
    <Suspense>
      <HomeClient populares={populares} categorias={categorias} allProdutos={allProdutos} />
    </Suspense>
  )
}
