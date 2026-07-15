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
  // Sem catch: falha da API sobe para app/error.tsx; [] legítimo → estado vazio.
  const produtos = await api.catalogo.listar()
  return <Suspense><CatalogoClient initialProdutos={produtos} /></Suspense>
}
