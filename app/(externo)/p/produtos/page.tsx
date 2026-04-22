import { Suspense } from 'react'
import { api } from '@/lib/api'
import { CatalogoClient } from '@/components/catalogo-client'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catálogo de Produtos',
  description: 'Explore nosso catálogo completo de soluções em isolamento acústico.',
}

export default async function ProdutosPage() {
  const produtos = await api.catalogo.listar().catch(() => [])
  return <Suspense><CatalogoClient initialProdutos={produtos} /></Suspense>
}
