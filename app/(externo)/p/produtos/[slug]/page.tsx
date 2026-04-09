import { api, DEV_REVALIDATE } from '@/lib/api'
import { notFound } from 'next/navigation'
import { ProdutoDetalheClient } from '@/components/produto-detalhe-client'
import type { Metadata } from 'next'

export const revalidate = DEV_REVALIDATE ?? 300

const BASE_URL = 'https://catalogo.isogesso.com.br'

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
      title: `${produto.nome} | ISO-GESSO`,
      description: produto.especificacao || `${produto.nome} — ${produto.categoria}. Soluções acústicas ISO-GESSO.`,
      openGraph: {
        title: produto.nome,
        description: produto.especificacao || `${produto.nome} — ${produto.categoria}`,
        url: `${BASE_URL}/p/produtos/${slug}`,
      },
    }
  } catch {
    return { title: 'Produto não encontrado | ISO-GESSO' }
  }
}

export default async function ProdutoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const produto = await api.catalogo.buscar(slug)

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ISO-GESSO',
          item: `${BASE_URL}/p`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Produtos',
          item: `${BASE_URL}/p/produtos`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: produto.categoria,
          item: `${BASE_URL}/p/produtos?categoria=${encodeURIComponent(produto.categoria)}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: produto.nome,
          item: `${BASE_URL}/p/produtos/${slug}`,
        },
      ],
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ProdutoDetalheClient produto={produto} />
      </>
    )
  } catch {
    notFound()
  }
}
