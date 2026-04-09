import { api, DEV_REVALIDATE } from '@/lib/api'
import { notFound } from 'next/navigation'
import { ProdutoDetalheClient } from '@/components/produto-detalhe-client'
import type { Metadata } from 'next'

export const revalidate = DEV_REVALIDATE ?? 300

export async function generateStaticParams() {
  try {
    const produtos = await api.catalogo.listar()
    return produtos
      .filter((p) => p.public_slug)
      .map((p) => ({ slug: p.public_slug! }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const produto = await api.catalogo.buscar(slug)
    return {
      title: `${produto.nome} | Catálogo Interno`,
      description: produto.especificacao || `${produto.nome} — ${produto.categoria}`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Produto não encontrado | ISO-GESSO' }
  }
}

export default async function ProdutoSlugInternoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const produto = await api.catalogo.buscar(slug)
    return <ProdutoDetalheClient produto={produto} />
  } catch {
    notFound()
  }
}
