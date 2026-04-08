import { Suspense } from 'react'
import { api } from '@/lib/api'
import { CatalogoClient } from '@/components/catalogo-client'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catálogo Interno',
  description: 'Catálogo interno com preços — acesso restrito à equipe.',
  robots: { index: false, follow: false },
}

export default async function ProdutosInternoPage() {
  const produtos = await api.catalogo.listar().catch(() => [])
  return <Suspense><CatalogoClient initialProdutos={produtos} /></Suspense>
}
