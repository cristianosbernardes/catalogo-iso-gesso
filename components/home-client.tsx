'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Package, ChevronRight, ChevronLeft, Layers, Ruler, Wrench, Disc, Sparkles, TrendingUp, ArrowRight,
} from 'lucide-react'
import { useCatalogContext } from '@/contexts/catalog-context'
import type { ProdutoBase } from '@/types'
import type { Categoria } from '@/lib/api'

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

const categoriaIcon: Record<string, React.ReactNode> = {
  Lã: <Layers className="h-6 w-6" />,
  Perfis: <Ruler className="h-6 w-6" />,
  Parafusos: <Wrench className="h-6 w-6" />,
  Placas: <Disc className="h-6 w-6" />,
  Acessórios: <Sparkles className="h-6 w-6" />,
  Revestimentos: <Layers className="h-6 w-6" />,
}

interface Props {
  populares: ProdutoBase[]
  categorias: Categoria[]
  allProdutos: ProdutoBase[]
}

/* ── Hero Banner Carousel ── */
function HeroBanner({ produtos, prefix }: { produtos: ProdutoBase[]; prefix: string }) {
  const bannerItems = produtos.filter((p) => p.produto_imagens && p.produto_imagens.length > 0).slice(0, 5)
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((i) => (i + 1) % bannerItems.length), [bannerItems.length])
  const prev = useCallback(() => setCurrent((i) => (i - 1 + bannerItems.length) % bannerItems.length), [bannerItems.length])

  useEffect(() => {
    if (bannerItems.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, bannerItems.length])

  if (bannerItems.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Soluções em <span className="text-primary">Isolamento Acústico</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Encontre materiais de alta performance para construção civil.
          </p>
          <Link href={`${prefix}/produtos`}>
            <Button size="lg" className="gap-2">
              Ver Catálogo <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  const item = bannerItems[current]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text */}
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 text-center md:text-left"
          >
            <Badge variant="secondary" className="mb-3">{item.categoria}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              {item.nome}
            </h1>
            {item.especificacao && (
              <p className="text-muted-foreground text-base md:text-lg mb-6 line-clamp-2 max-w-lg">
                {item.especificacao}
              </p>
            )}
            <Link href={`${prefix}/produtos/${item.public_slug || item.id}`}>
              <Button size="lg" className="gap-2">
                Ver Produto <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            key={`img-${current}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full md:w-[420px] h-64 md:h-80 rounded-2xl overflow-hidden bg-muted/30 shrink-0"
          >
            <img
              src={item.produto_imagens![0].url}
              alt={item.nome}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Controls */}
        {bannerItems.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {bannerItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Main Home Component ── */
export function HomeClient({ populares, categorias, allProdutos }: Props) {
  const { prefix, isInternal } = useCatalogContext()

  return (
    <div>
      {/* Hero Banner Carousel */}
      <HeroBanner produtos={populares.length > 0 ? populares : allProdutos} prefix={prefix} />

      {/* Coleções / Categorias */}
      {categorias.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div {...fadeIn}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Coleções</h2>
              <Link
                href={`${prefix}/produtos`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Ver todas <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.1, ease: 'easeOut' as const }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  href={`${prefix}/produtos?categoria=${encodeURIComponent(cat.nome)}`}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group text-center">
                    <CardContent className="p-5 flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {categoriaIcon[cat.nome] || <Package className="h-6 w-6" />}
                      </div>
                      <span className="text-sm font-medium text-foreground">{cat.nome}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Produtos Mais Vendidos */}
      {populares.length > 0 && (
        <section className="bg-muted/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeIn}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Mais Populares</h2>
                </div>
                <Link
                  href={`${prefix}/produtos`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1, ease: 'easeOut' as const }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {populares.slice(0, 8).map((p) => (
                  <Link key={p.id} href={`${prefix}/produtos/${p.public_slug || p.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-5">
                        <div className="flex h-36 items-center justify-center rounded-lg bg-muted/50 mb-4 overflow-hidden">
                          {p.produto_imagens && p.produto_imagens.length > 0 ? (
                            <img
                              src={p.produto_imagens[0].url}
                              alt={p.nome}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <Package className="h-10 w-10 text-muted-foreground/40" />
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
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div {...fadeIn}>
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Precisa de ajuda com seu projeto?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Nossa equipe está pronta para ajudar com especificações técnicas e orçamentos personalizados.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href={`${prefix}/contato`}>
                  <Button size="lg" className="gap-2">
                    Solicitar Orçamento <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`${prefix}/produtos`}>
                  <Button variant="outline" size="lg">
                    Explorar Catálogo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
