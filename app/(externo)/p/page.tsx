import { Suspense } from 'react'
import { api } from '@/lib/api'
import { HomeClient } from '@/components/home-client'
import type { Metadata } from 'next'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'ISO-GESSO | Soluções em Isolamento Acústico',
  description: 'Catálogo completo de soluções em isolamento acústico e materiais de alta performance para construção civil.',
}

export default async function HomePage() {
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
