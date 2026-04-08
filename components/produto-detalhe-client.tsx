'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Package, ChevronLeft, Layers, Ruler, Wrench, Disc, Sparkles,
  Volume2, Thermometer, ShieldCheck, Palette, BoxSelect,
} from 'lucide-react'
import type { ProdutoBase } from '@/types'

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

const categoriaIcon: Record<string, React.ReactNode> = {
  Lã: <Layers className="h-5 w-5" />,
  Perfis: <Ruler className="h-5 w-5" />,
  Parafusos: <Wrench className="h-5 w-5" />,
  Placas: <Disc className="h-5 w-5" />,
  Acessórios: <Sparkles className="h-5 w-5" />,
}

const SpecCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-[12px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-base font-bold text-foreground">{value}</p>
  </div>
)

interface Props {
  produto: ProdutoBase
}

export function ProdutoDetalheClient({ produto: p }: Props) {
  const specs =
    p.produto_las ||
    p.produto_placas ||
    p.produto_perfis ||
    p.produto_parafusos ||
    p.produto_acessorios ||
    p.produto_revestimentos

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <motion.div {...fadeIn}>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div {...fadeIn} transition={{ delay: 0.05, ease: 'easeOut' as const }}>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Image */}
          <div className="w-full md:w-80 h-64 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
            {p.produto_imagens && p.produto_imagens.length > 0 ? (
              <img
                src={p.produto_imagens[0].url}
                alt={p.nome}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Package className="h-16 w-16 text-muted-foreground/30" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {categoriaIcon[p.categoria] || <Package className="h-5 w-5 text-muted-foreground" />}
              <Badge variant="secondary">{p.categoria}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{p.nome}</h1>
            <p className="text-sm text-muted-foreground font-mono mb-4">{p.sku}</p>

            {p.especificacao && (
              <p className="text-muted-foreground leading-relaxed">{p.especificacao}</p>
            )}

            {p.cores.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Cores disponíveis
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.cores.map((cor) => (
                    <Badge key={cor} variant="outline">
                      <Palette className="h-3 w-3 mr-1" /> {cor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {p.locais_instalacao.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Locais de instalação
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.locais_instalacao.map((local) => (
                    <Badge key={local} variant="outline">
                      {local}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Separator className="mb-8" />

      {/* Specs */}
      {specs && (
        <motion.div {...fadeIn} transition={{ delay: 0.15, ease: 'easeOut' as const }}>
          <h2 className="text-lg font-semibold mb-4">Especificações Técnicas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {p.produto_las && (
              <>
                {p.produto_las.densidade && (
                  <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Densidade" value={p.produto_las.densidade} />
                )}
                {p.produto_las.espessura && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Espessura" value={p.produto_las.espessura} />
                )}
                {p.produto_las.nrc && (
                  <SpecCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.produto_las.nrc} />
                )}
                {p.produto_las.resistencia_termica && (
                  <SpecCard
                    icon={<Thermometer className="h-4 w-4" />}
                    label="Resistência Térmica"
                    value={p.produto_las.resistencia_termica}
                  />
                )}
              </>
            )}
            {p.produto_placas && (
              <>
                {p.produto_placas.tipo && (
                  <SpecCard icon={<Disc className="h-4 w-4" />} label="Tipo" value={p.produto_placas.tipo} />
                )}
                {p.produto_placas.espessura && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Espessura" value={p.produto_placas.espessura} />
                )}
                {p.produto_placas.dimensao && (
                  <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Dimensão" value={p.produto_placas.dimensao} />
                )}
                {p.produto_placas.nrc && (
                  <SpecCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.produto_placas.nrc} />
                )}
              </>
            )}
            {p.produto_revestimentos && (
              <>
                {p.produto_revestimentos.material && (
                  <SpecCard icon={<Layers className="h-4 w-4" />} label="Material" value={p.produto_revestimentos.material} />
                )}
                {p.produto_revestimentos.acabamento && (
                  <SpecCard icon={<Sparkles className="h-4 w-4" />} label="Acabamento" value={p.produto_revestimentos.acabamento} />
                )}
                {p.produto_revestimentos.formato && (
                  <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Formato" value={p.produto_revestimentos.formato} />
                )}
                {p.produto_revestimentos.espessuras && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Espessuras" value={p.produto_revestimentos.espessuras} />
                )}
                {p.produto_revestimentos.nrc && (
                  <SpecCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.produto_revestimentos.nrc} />
                )}
                {p.produto_revestimentos.tipo_fixacao && (
                  <SpecCard icon={<Wrench className="h-4 w-4" />} label="Fixação" value={p.produto_revestimentos.tipo_fixacao} />
                )}
                {p.produto_revestimentos.composicao && (
                  <SpecCard icon={<ShieldCheck className="h-4 w-4" />} label="Composição" value={p.produto_revestimentos.composicao} />
                )}
              </>
            )}
            {p.produto_perfis && (
              <>
                {p.produto_perfis.tipo && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Tipo" value={p.produto_perfis.tipo} />
                )}
                {p.produto_perfis.largura && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Largura" value={p.produto_perfis.largura} />
                )}
                {p.produto_perfis.comprimento && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Comprimento" value={p.produto_perfis.comprimento} />
                )}
                {p.produto_perfis.acabamento && (
                  <SpecCard icon={<Sparkles className="h-4 w-4" />} label="Acabamento" value={p.produto_perfis.acabamento} />
                )}
              </>
            )}
            {p.produto_parafusos && (
              <>
                {p.produto_parafusos.tipo && (
                  <SpecCard icon={<Wrench className="h-4 w-4" />} label="Tipo" value={p.produto_parafusos.tipo} />
                )}
                {p.produto_parafusos.diametro && (
                  <SpecCard icon={<Disc className="h-4 w-4" />} label="Diâmetro" value={p.produto_parafusos.diametro} />
                )}
                {p.produto_parafusos.comprimento && (
                  <SpecCard icon={<Ruler className="h-4 w-4" />} label="Comprimento" value={p.produto_parafusos.comprimento} />
                )}
                {p.produto_parafusos.material && (
                  <SpecCard icon={<ShieldCheck className="h-4 w-4" />} label="Material" value={p.produto_parafusos.material} />
                )}
              </>
            )}
            {p.produto_acessorios && (
              <>
                {p.produto_acessorios.tipo && (
                  <SpecCard icon={<Sparkles className="h-4 w-4" />} label="Tipo" value={p.produto_acessorios.tipo} />
                )}
                {p.produto_acessorios.aplicacao && (
                  <SpecCard icon={<Wrench className="h-4 w-4" />} label="Aplicação" value={p.produto_acessorios.aplicacao} />
                )}
                {p.produto_acessorios.rendimento && (
                  <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Rendimento" value={p.produto_acessorios.rendimento} />
                )}
              </>
            )}
            {p.classificacao_fogo && (
              <SpecCard
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Classificação Fogo"
                value={p.classificacao_fogo}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div {...fadeIn} transition={{ delay: 0.25, ease: 'easeOut' as const }}>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Interessado neste produto?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Entre em contato para orçamento personalizado.
            </p>
            <Link href="/contato">
              <Button size="lg">Solicitar Orçamento</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
