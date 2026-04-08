'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Package, Trash2, ExternalLink, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useFavoritos } from '@/hooks/useFavoritos'
import { useCatalogContext } from '@/contexts/catalog-context'

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' as const },
}

export function FavoritosClient() {
  const { favoritos, removeFavorito, clearFavoritos, count } = useFavoritos()
  const { prefix, isInternal } = useCatalogContext()

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-destructive" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Meus Favoritos</h1>
              <p className="text-xs text-muted-foreground">
                {count} {count === 1 ? 'produto salvo' : 'produtos salvos'}
              </p>
            </div>
          </div>
          {count > 0 && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={clearFavoritos}>
              <Trash2 className="h-3.5 w-3.5" />
              Limpar tudo
            </Button>
          )}
        </motion.div>

        {/* Warning */}
        <motion.div
          {...fadeIn}
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Favoritos salvos localmente</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Seus favoritos estão salvos neste navegador. Se limpar os dados do navegador ou trocar
              de dispositivo, eles serão perdidos.
            </p>
          </div>
        </motion.div>

        {/* Products */}
        {count === 0 ? (
          <motion.div
            {...fadeIn}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3"
          >
            <Heart className="h-16 w-16 opacity-20" />
            <p className="text-lg font-bold text-foreground">Nenhum favorito ainda</p>
            <p className="text-sm">Explore nossos produtos e salve seus favoritos.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favoritos.map((fav, i) => (
              <motion.div
                key={fav.productId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="p-0 overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    {/* Image */}
                    <Link
                      href={`${prefix}/produtos/${fav.slug}`}
                      className="shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-muted/30 border border-border flex items-center justify-center"
                    >
                      {fav.imageUrl ? (
                        <img src={fav.imageUrl} alt={fav.nome} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground/30" />
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {fav.categoria}
                        </Badge>
                      </div>
                      <Link href={`${prefix}/produtos/${fav.slug}`}>
                        <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">
                          {fav.nome}
                        </p>
                      </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link href={`${prefix}/produtos/${fav.slug}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeFavorito(fav.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
