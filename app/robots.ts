import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/p/', disallow: '/pi/' },
    ],
    sitemap: 'https://catalogo.isogesso.com.br/sitemap.xml',
  }
}
