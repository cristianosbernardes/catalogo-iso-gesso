import { api } from '@/lib/api'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let produtosRoutes: MetadataRoute.Sitemap = []

  try {
    const produtos = await api.catalogo.listar()
    produtosRoutes = produtos
      .filter((p) => p.public_slug)
      .map((p) => ({
        url: `https://catalogo.isogesso.com.br/produtos/${p.public_slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  } catch {
    // API offline — generate sitemap without product routes
  }

  return [
    { url: 'https://catalogo.isogesso.com.br', lastModified: new Date(), priority: 1 },
    { url: 'https://catalogo.isogesso.com.br/produtos', lastModified: new Date(), priority: 0.9 },
    { url: 'https://catalogo.isogesso.com.br/contato', lastModified: new Date(), priority: 0.5 },
    ...produtosRoutes,
  ]
}
