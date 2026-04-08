'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, Search, Layers, Ruler, Wrench, Disc, Sparkles } from 'lucide-react'
import { useCatalogContext } from '@/contexts/catalog-context'
import type { ProdutoBase } from '@/types'

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' as const },
}

const categoriaIcon: Record<string, React.ReactNode> = {
  Lã: <Layers className="h-4 w-4" />,
  Perfis: <Ruler className="h-4 w-4" />,
  Parafusos: <Wrench className="h-4 w-4" />,
  Placas: <Disc className="h-4 w-4" />,
  Acessórios: <Sparkles className="h-4 w-4" />,
}

interface Props {
  initialProdutos: ProdutoBase[]
}

export function CatalogoClient({ initialProdutos }: Props) {
  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const activeCategoria = searchParams.get('categoria') || 'Todos'
  const { prefix, isInternal } = useCatalogContext()

  const produtos = initialProdutos
  const categorias = ['Todos', ...new Set(produtos.map((p) => p.categoria))]

  const filtered = produtos.filter((p) => {
    const matchSearch =
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategoria === 'Todos' || p.categoria === activeCategoria
    return matchSearch && matchCat
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Produtos</h1>
        <p className="text-muted-foreground mb-8">
          Encontre o material ideal para o seu projeto acústico.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeIn} transition={{ delay: 0.1, ease: 'easeOut' as const }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative max-w-sm flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou SKU..."
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={
                  cat === 'Todos'
                    ? `${prefix}/produtos`
                    : `${prefix}/produtos?categoria=${encodeURIComponent(cat)}`
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategoria === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {categoriaIcon[cat] || <Package className="h-4 w-4" />}
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div {...fadeIn} transition={{ delay: 0.2, ease: 'easeOut' as const }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <Link key={p.id} href={`${prefix}/produtos/${p.public_slug || p.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex h-32 items-center justify-center rounded-lg bg-muted/50 mb-4 overflow-hidden">
                    {p.produto_imagens && p.produto_imagens.length > 0 ? (
                      <img
                        src={p.produto_imagens[0].url}
                        alt={p.nome}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                    )}
                  </div>
                  <Badge variant="secondary" className="mb-2 text-[10px]">
                    {p.categoria}
                  </Badge>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
                    {p.nome}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                  {isInternal && p.preco > 0 && (
                    <p className="text-sm font-bold text-primary mt-2">
                      R$ {Number(p.preco).toFixed(2)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mb-3 opacity-40" />
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
