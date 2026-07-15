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
  // Sem catch: se a API falhar, o erro sobe para app/error.tsx (UI de "tente
  // novamente"). Um retorno [] legítimo cai no estado vazio do CatalogoClient.
  const produtos = await api.catalogo.listar()
  return <Suspense><CatalogoClient initialProdutos={produtos} /></Suspense>
}
