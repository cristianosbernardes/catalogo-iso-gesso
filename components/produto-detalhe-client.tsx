'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Package, ChevronLeft, ChevronRight, Layers, Ruler, Wrench, Disc, Sparkles,
  Volume2, Thermometer, ShieldCheck, Palette, BoxSelect,
  Heart, Share2, Copy, Check, MapPin, BarChart3, Flame,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useCatalogContext } from '@/contexts/catalog-context'
import { useFavoritos } from '@/hooks/useFavoritos'
import { formatBRL } from '@/lib/produto-card-price'
import type { ProdutoBase, ProdutoImagem } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_FREQS = ['63', '125', '250', '500', '1000', '2000', '4000', '8000'] as const
type Freq = (typeof ALL_FREQS)[number]
const FREQ_LABELS: Record<Freq, string> = {
  '63': '63Hz', '125': '125Hz', '250': '250Hz', '500': '500Hz',
  '1000': '1kHz', '2000': '2kHz', '4000': '4kHz', '8000': '8kHz',
}

const categoriaIcon: Record<string, React.ReactNode> = {
  'Lã': <Layers className="h-4 w-4" />,
  'Perfis': <Ruler className="h-4 w-4" />,
  'Parafusos': <Wrench className="h-4 w-4" />,
  'Placas': <Disc className="h-4 w-4" />,
  'Acessórios': <Sparkles className="h-4 w-4" />,
  'Revestimento Absorvedor': <Layers className="h-4 w-4" />,
}

// ─── SpecCard ─────────────────────────────────────────────────────────────────

const SpecCard = ({
  icon, label, value, sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-1 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-1.5">
      <span className="text-primary">{icon}</span>
      <span className="text-[14px] font-semibold text-foreground">{label}</span>
    </div>
    <p className="text-[12px] text-muted-foreground">{value}</p>
    {sub && <p className="text-[11px] text-muted-foreground/70">{sub}</p>}
  </div>
)

// ─── AlphaChart ───────────────────────────────────────────────────────────────

function AlphaChart({
  alpha,
  nrc,
  classificacaoFogo,
}: {
  alpha: Record<string, number>
  nrc?: string | null
  classificacaoFogo?: string | null
}) {
  const [mode, setMode] = useState<'curvas' | 'barras'>('curvas')

  const data = ALL_FREQS.map((f) => ({
    freq: Number(f) >= 1000 ? `${Number(f) / 1000}kHz` : `${f}Hz`,
    alpha: alpha[f] != null ? Number(alpha[f]) : 0,
    rawFreq: f,
  }))

  const maxVal = Math.max(...data.map((d) => d.alpha), 0.01)
  const bestEntry = data.reduce((best, d) => (d.alpha > best.alpha ? d : best), data[0])
  const hasData = data.some((d) => d.alpha > 0)
  const bandCount = data.filter((d) => d.alpha > 0).length

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">Coeficientes de Absorção Sonora (α)</span>
          {hasData && (
            <span className="text-xs text-muted-foreground">
              Melhor: {bestEntry.freq} (α = {bestEntry.alpha.toFixed(2)})
            </span>
          )}
        </div>
        {hasData && (
          <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setMode('curvas')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mode === 'curvas'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Curvas
            </button>
            <button
              onClick={() => setMode('barras')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mode === 'barras'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Barras
            </button>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {nrc && (
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">NRC</p>
              <p className="text-3xl font-bold font-mono text-primary">{nrc}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Noise Reduction Coefficient</p>
            </div>
          )}
          {classificacaoFogo && (
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <Flame className="h-5 w-5 mx-auto mb-1.5 text-destructive" />
              <p className="text-sm font-semibold">{classificacaoFogo}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Classificação quanto ao Fogo</p>
            </div>
          )}
          {hasData && (
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <BarChart3 className="h-5 w-5 mx-auto mb-1.5 text-primary/70" />
              <p className="text-sm font-semibold">{bandCount} bandas</p>
              <p className="text-[10px] text-muted-foreground mt-1">Curva de Desempenho (125Hz–4kHz)</p>
            </div>
          )}
        </div>

        {/* Chart */}
        {hasData && (
          mode === 'barras' ? (
            <div className="space-y-2.5">
              {data.map((d) => (
                <div key={d.rawFreq} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-10 shrink-0">{d.freq}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(d.alpha / maxVal) * 100}%`, backgroundColor: '#006daa' }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-8 text-right shrink-0">
                    {d.alpha.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="alphaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#006daa" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#006daa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis dataKey="freq" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`α = ${Number(value).toFixed(2)}`, '']} />
                <Area
                  type="monotone"
                  dataKey="alpha"
                  stroke="#006daa"
                  strokeWidth={2}
                  fill="url(#alphaGradient)"
                  fillOpacity={1}
                  dot={false}
                  activeDot={{ r: 5, fill: '#006daa', strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )
        )}
      </div>
    </div>
  )
}

// ─── PriceDisplay ────────────────────────────────────────────────────────────

interface PriceDisplayProps {
  variante: { preco: number; preco_promocional?: number | null } | null
  precoProduto: number
}

function PriceDisplay({ variante, precoProduto }: PriceDisplayProps) {
  const preco = variante?.preco ?? precoProduto
  const precoPromo = variante?.preco_promocional ?? null

  return (
    <div>
      {precoPromo ? (
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl font-bold" style={{ color: '#16a34a' }}>
            {formatBRL(Number(precoPromo))}
          </span>
          <span className="text-base text-muted-foreground line-through">
            {formatBRL(Number(preco))}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            Promoção
          </span>
        </div>
      ) : (
        <span className="text-2xl font-bold" style={{ color: '#006DAA' }}>
          {formatBRL(Number(preco))}
        </span>
      )}
    </div>
  )
}

// ─── ImageGallery ─────────────────────────────────────────────────────────────

function ImageGallery({ images, nome }: { images: ProdutoImagem[]; nome: string }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted/50 flex items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground/30" />
      </div>
    )
  }

  const safeIdx = Math.min(activeIdx, images.length - 1)
  const activeImage = images[safeIdx]
  const goPrev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setActiveIdx((i) => (i + 1) % images.length)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] w-full rounded-2xl bg-muted/50 overflow-hidden cursor-zoom-in"
        style={{ maxHeight: 480 }}
        onClick={() => setLightboxOpen(true)}
      >
        <motion.img
          key={activeImage.id}
          src={activeImage.url}
          alt={nome}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>

            {/* Counter — bottom right */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
              <span className="text-white text-xs font-medium tabular-nums">
                {safeIdx + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — horizontal scroll, desktop and mobile */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 shrink-0 w-16 transition-all ${
                i === safeIdx
                  ? 'border-primary shadow-md scale-[1.03]'
                  : 'border-transparent hover:border-border'
              }`}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <img
                src={img.url}
                alt={`${nome} — imagem ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            aria-label="Fechar"
          >
            <ChevronLeft className="h-5 w-5 rotate-[-90deg] hidden" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium tabular-nums">
            {safeIdx + 1} / {images.length}
          </div>

          {/* Image */}
          <motion.img
            key={`lb-${activeImage.id}`}
            src={activeImage.url}
            alt={nome}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => (i - 1 + images.length) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => (i + 1) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Thumbnails strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 overflow-x-auto max-w-[90vw]">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(i) }}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === safeIdx ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img src={img.url} alt={`${nome} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  produto: ProdutoBase
}

export function ProdutoDetalheClient({ produto: p }: Props) {
  const { prefix, isInternal } = useCatalogContext()
  const { isFavorito, toggleFavorito } = useFavoritos()

  // Pre-select the default (or first) variant on load
  const activeVariants = p.variantes?.filter((v) => v.ativo) ?? []
  const defaultVariante = activeVariants.find((v) => v.padrao) ?? activeVariants[0] ?? null

  const [selectedColor, setSelectedColor] = useState<string | null>(defaultVariante?.cor ?? null)
  const [selectedAtributos, setSelectedAtributos] = useState<Record<string, string>>(
    defaultVariante?.atributos ?? {}
  )
  const [copied, setCopied] = useState(false)
  const [colorLightbox, setColorLightbox] = useState<{ cor: string; url: string } | null>(null)

  // ── Carousel de cores ──
  const coresScrollRef = useRef<HTMLDivElement>(null)
  const [coresEdges, setCoresEdges] = useState({ left: false, right: false })

  const updateCoresEdges = useCallback(() => {
    const el = coresScrollRef.current
    if (!el) return
    setCoresEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }, [])

  const scrollCores = useCallback((dir: 'left' | 'right') => {
    const el = coresScrollRef.current
    if (!el) return
    const step = Math.max(el.clientWidth * 0.8, 200)
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    updateCoresEdges()
    const el = coresScrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateCoresEdges, { passive: true })
    window.addEventListener('resize', updateCoresEdges)
    return () => {
      el.removeEventListener('scroll', updateCoresEdges)
      window.removeEventListener('resize', updateCoresEdges)
    }
  }, [updateCoresEdges, p.cores.length, p.produto_cores?.length])

  // Filter images by selected color
  const allImages = p.produto_imagens ?? []
  const coloredImages = selectedColor
    ? allImages.filter((img) => img.cor === selectedColor)
    : []
  const filteredImages =
    selectedColor && coloredImages.length > 0 ? coloredImages : allImages

  // ── Unified cores list: prefer produto_cores (nova fonte), fallback para
  //    p.cores + produto_imagens.cor (formato legado). ──
  const coresList = useMemo<{ nome: string; url: string | null }[]>(() => {
    const imgs = p.produto_imagens ?? []
    if (p.produto_cores && p.produto_cores.length > 0) {
      return [...p.produto_cores]
        .sort((a, b) => a.ordem - b.ordem)
        .map((c) => ({ nome: c.nome, url: c.imagem_url ?? null }))
    }
    return p.cores.map((nome) => ({
      nome,
      url: imgs.find((i) => i.cor === nome)?.url ?? null,
    }))
  }, [p.produto_cores, p.cores, p.produto_imagens])

  // ── Navegação dentro do lightbox de cores (setas e teclado) ──
  useEffect(() => {
    if (!colorLightbox) return
    const list = coresList.filter((c): c is { nome: string; url: string } => !!c.url)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setColorLightbox(null); return }
      if (list.length < 2) return
      const idx = list.findIndex((c) => c.nome === colorLightbox.cor)
      if (idx < 0) return
      if (e.key === 'ArrowLeft') setColorLightbox({ cor: list[(idx - 1 + list.length) % list.length].nome, url: list[(idx - 1 + list.length) % list.length].url })
      else if (e.key === 'ArrowRight') setColorLightbox({ cor: list[(idx + 1) % list.length].nome, url: list[(idx + 1) % list.length].url })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [colorLightbox, coresList])

  // ── Cores provenientes das variantes (distintas, em ordem de aparição) ──
  // O seletor de cores no sidebar SÓ aparece se houver variantes com cor
  // cadastrada E ao menos uma delas tiver imagem registrada (via produto_cores
  // ou produto_imagens). Isso evita exibir o chip quando o produto tem cores
  // no bloco "Cores" (carrossel) mas nenhuma variante as referencia.
  const variantColors = [...new Set(
    activeVariants.map((v) => v.cor).filter((c): c is string => !!c)
  )]
  const hasVariantColorWithImage = variantColors.some((cor) =>
    coresList.some((c) => c.nome === cor && !!c.url)
  )
  const showVariantColorSelector = variantColors.length > 0 && hasVariantColorWithImage

  // ── All attribute keys/values across EVERY variant (for always-visible matrix) ──
  // Filter out generic keys like attr_0, attr_1 that indicate unnamed attributes in the CRM
  const allAtributoKeys = [...new Set(activeVariants.flatMap((v) => Object.keys(v.atributos ?? {})))]
    .filter((key) => !/^attr_\d+$/i.test(key))
  const allAtributoValues: Record<string, string[]> = {}
  for (const key of allAtributoKeys) {
    allAtributoValues[key] = [...new Set(
      activeVariants.map((v) => v.atributos?.[key]).filter((x): x is string => !!x)
    )]
  }

  // ── Resolve variant from color + selected attributes ──
  const resolvedVariante = activeVariants.find((v) => {
    if (selectedColor && v.cor !== selectedColor) return false
    return Object.entries(selectedAtributos).every(([k, val]) => v.atributos?.[k] === val)
  }) ?? (selectedColor
    ? activeVariants.find((v) => v.cor === selectedColor && v.padrao) ??
      activeVariants.find((v) => v.cor === selectedColor) ??
      null
    : null)

  // ── Availability checks for grayed-out state ──
  const isColorAvailable = (cor: string): boolean => {
    if (Object.keys(selectedAtributos).length === 0) return true
    return activeVariants.some((v) =>
      v.cor === cor &&
      Object.entries(selectedAtributos).every(([k, val]) => v.atributos?.[k] === val)
    )
  }

  const isAtributoValueAvailable = (key: string, value: string): boolean => {
    if (!selectedColor) return activeVariants.some((v) => v.atributos?.[key] === value)
    return activeVariants.some((v) => v.cor === selectedColor && v.atributos?.[key] === value)
  }

  const handleColorSelect = useCallback((cor: string) => {
    if (selectedColor === cor) {
      setSelectedColor(null)
      return
    }
    setSelectedColor(cor)
    // Keep attributes that are still valid for the new color; reset others
    setSelectedAtributos((prev) => {
      const variantsForNewColor = activeVariants.filter((v) => v.cor === cor)
      if (variantsForNewColor.length === 0) return prev
      // Try to find a variant that matches current attribute selection
      const stillValid = variantsForNewColor.find((v) =>
        Object.entries(prev).every(([k, val]) => v.atributos?.[k] === val)
      )
      if (stillValid) return prev
      // Fall back to padrao or first variant of the new color
      const fallback = variantsForNewColor.find((v) => v.padrao) ?? variantsForNewColor[0]
      return fallback?.atributos ?? {}
    })
  }, [selectedColor, activeVariants])

  const isFav = isFavorito(p.id)

  const handleFavorite = useCallback(() => {
    toggleFavorito({
      productId: p.id,
      slug: p.public_slug ?? p.id,
      nome: p.nome,
      categoria: p.categoria,
      preco: p.preco,
      imageUrl: allImages[0]?.url,
      addedAt: new Date().toISOString(),
    })
  }, [p, allImages, toggleFavorito])

  const handleShare = useCallback(async () => {
    const url = p.public_share_url ?? window.location.href
    if (navigator.share) {
      await navigator.share({ title: p.nome, url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }, [p])

  const handleCopy = useCallback(async () => {
    const url = p.public_share_url ?? window.location.href
    await navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [p])

  // Alpha coefficients — present in lã, placa, revestimento
  const alphaData =
    p.produto_las?.alpha_coefficients ||
    p.produto_placas?.alpha_coefficients ||
    p.produto_revestimentos?.alpha_coefficients ||
    null

  const nrcValue =
    p.produto_las?.nrc ||
    p.produto_placas?.nrc ||
    p.produto_revestimentos?.nrc ||
    null

  const classificacaoFogo =
    p.classificacao_fogo ||
    p.produto_revestimentos?.classificacao_fogo ||
    null

  const hasSpecs = !!(
    p.produto_las ||
    p.produto_placas ||
    p.produto_perfis ||
    p.produto_parafusos ||
    p.produto_acessorios ||
    p.produto_revestimentos
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Breadcrumb"
        className="mb-4"
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
          <li>
            <Link href={prefix} className="hover:text-foreground transition-colors">
              Início
            </Link>
          </li>
          <li><ChevronRight className="h-3.5 w-3.5 shrink-0" /></li>
          <li>
            <Link href={`${prefix}/produtos`} className="hover:text-foreground transition-colors">
              Produtos
            </Link>
          </li>
          <li><ChevronRight className="h-3.5 w-3.5 shrink-0" /></li>
          <li>
            <Link
              href={`${prefix}/produtos?categoria=${encodeURIComponent(p.categoria)}`}
              className="hover:text-foreground transition-colors"
            >
              {p.categoria}
            </Link>
          </li>
          <li><ChevronRight className="h-3.5 w-3.5 shrink-0" /></li>
          <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
            {p.nome}
          </li>
        </ol>
      </motion.nav>

      {/* ── Top section: gallery + info ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 mb-12"
      >
        {/* Left — Gallery (60%) */}
        <div className="lg:col-span-3">
          <ImageGallery images={filteredImages} nome={p.nome} />
        </div>

        {/* Right — Info (40%) */}
        <div className="lg:col-span-2 flex flex-col gap-3.5">
          {/* Category + Name + SKU */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {categoriaIcon[p.categoria] || <Package className="h-4 w-4 text-muted-foreground" />}
              <Badge variant="secondary" className="text-xs">{p.categoria}</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-1">
              {p.nome}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">SKU: {p.sku}</p>
          </div>

          {/* Price — dynamic, internal only */}
          {isInternal && (
            <PriceDisplay
              variante={resolvedVariante}
              precoProduto={p.preco}
            />
          )}

          <Separator />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={isFav ? 'default' : 'outline'}
              size="sm"
              onClick={handleFavorite}
              className="gap-1.5"
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
              {isFav ? 'Favoritado' : 'Favoritar'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied
                ? <Check className="h-4 w-4 text-green-600" />
                : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado!' : 'Copiar link'}
            </Button>
          </div>

          {/* Color selector — só aparece para variantes com cor + imagem */}
          {showVariantColorSelector && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5" />
                {selectedColor ? `Cor: ${selectedColor}` : 'Cores disponíveis'}
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {variantColors.map((cor) => {
                  const available = isColorAvailable(cor)
                  const selected = selectedColor === cor
                  return (
                    <button
                      key={cor}
                      onClick={() => available ? handleColorSelect(cor) : undefined}
                      disabled={!available}
                      className={`px-2.5 py-1 rounded-md text-xs border font-medium transition-all ${
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : available
                            ? 'border-border hover:border-primary/50 text-foreground bg-card cursor-pointer'
                            : 'border-border/40 text-muted-foreground/40 bg-muted/30 cursor-not-allowed line-through'
                      }`}
                    >
                      {cor}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Attribute selectors — ALL keys/values always visible, unavailable grayed */}
          {allAtributoKeys.map((key) => {
            const values = allAtributoValues[key] ?? []
            if (values.length === 0) return null
            return (
              <div key={key}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                  {key}
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => {
                    const available = isAtributoValueAvailable(key, val)
                    const selected = selectedAtributos[key] === val
                    return (
                      <button
                        key={val}
                        onClick={() =>
                          available
                            ? setSelectedAtributos((prev) => ({ ...prev, [key]: val }))
                            : undefined
                        }
                        disabled={!available}
                        className={`px-2.5 py-1 rounded-md text-xs border font-medium transition-all ${
                          selected
                            ? 'border-primary bg-primary/10 text-primary'
                            : available
                              ? 'border-border hover:border-primary/50 text-foreground bg-card cursor-pointer'
                              : 'border-border/40 text-muted-foreground/40 bg-muted/30 cursor-not-allowed line-through'
                        }`}
                      >
                        {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* CTA */}
          <div className="pt-2">
            <Link href={`${prefix}/contato`}>
              <Button size="lg" className="w-full">Solicitar Orçamento</Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom section: description + specs ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="space-y-10"
      >
        <Separator />

        {/* Descrição */}
        {p.especificacao && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Descrição</h2>
            <p className="text-muted-foreground leading-relaxed">{p.especificacao}</p>
          </div>
        )}

        {/* Cores — carrossel horizontal com setas laterais */}
        {coresList.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Cores</h2>
            <div className="relative group/cores">
              <div
                ref={coresScrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {coresList.map(({ nome, url }) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => url && setColorLightbox({ cor: nome, url })}
                    disabled={!url}
                    className="group flex flex-col gap-2 text-left disabled:cursor-default shrink-0 w-36 sm:w-40 snap-start"
                    aria-label={`Ver cor ${nome}`}
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-muted/50 border border-border shadow-sm transition-all group-enabled:group-hover:shadow-md group-enabled:group-hover:scale-[1.02] group-enabled:cursor-zoom-in">
                      {url ? (
                        <img
                          src={url}
                          alt={nome}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] font-medium text-foreground uppercase tracking-wide text-center">
                      {nome}
                    </p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollCores('left')}
                disabled={!coresEdges.left}
                aria-label="Cores anteriores"
                className="absolute left-0 top-[calc(50%-14px)] -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-foreground transition-all hover:bg-muted disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCores('right')}
                disabled={!coresEdges.right}
                aria-label="Próximas cores"
                className="absolute right-0 top-[calc(50%-14px)] -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-foreground transition-all hover:bg-muted disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Color lightbox */}
        {colorLightbox && (() => {
          const lightboxList = coresList
            .filter((c): c is { nome: string; url: string } => !!c.url)
            .map((c) => ({ cor: c.nome, url: c.url }))
          const lbIdx = lightboxList.findIndex((c) => c.cor === colorLightbox.cor)
          const goPrev = () => lightboxList.length > 1 && setColorLightbox(lightboxList[(lbIdx - 1 + lightboxList.length) % lightboxList.length])
          const goNext = () => lightboxList.length > 1 && setColorLightbox(lightboxList[(lbIdx + 1) % lightboxList.length])
          return (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setColorLightbox(null)}
            >
              <button
                onClick={() => setColorLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium uppercase tracking-wide">
                {colorLightbox.cor}
                {lightboxList.length > 1 && (
                  <span className="ml-2 text-white/60">{lbIdx + 1}/{lightboxList.length}</span>
                )}
              </div>

              {lightboxList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goPrev() }}
                    aria-label="Cor anterior"
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goNext() }}
                    aria-label="Próxima cor"
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <motion.img
                key={colorLightbox.url}
                src={colorLightbox.url}
                alt={colorLightbox.cor}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )
        })()}

        {/* Especificações técnicas */}
        {hasSpecs && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Especificações Técnicas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {p.produto_las && (
                <>
                  {p.produto_las.espessura && (
                    <SpecCard icon={<Ruler className="h-4 w-4" />} label="Espessura" value={p.produto_las.espessura} />
                  )}
                  {p.produto_las.densidade && (
                    <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Densidade" value={p.produto_las.densidade} />
                  )}
                  {p.produto_las.resistencia_termica && (
                    <SpecCard icon={<Thermometer className="h-4 w-4" />} label="Resistência Térmica" value={p.produto_las.resistencia_termica} sub="Isolamento térmico" />
                  )}
                  {p.produto_las.nrc && (
                    <SpecCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.produto_las.nrc} sub="Coeficiente de redução de ruído" />
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
                  {p.produto_placas.peso && (
                    <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Peso" value={p.produto_placas.peso} />
                  )}
                  {p.produto_placas.nrc && (
                    <SpecCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.produto_placas.nrc} />
                  )}
                  {p.produto_placas.borda_modelo && (
                    <SpecCard icon={<Sparkles className="h-4 w-4" />} label="Borda" value={p.produto_placas.borda_modelo} />
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
                  {p.produto_revestimentos.densidade && (
                    <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Densidade" value={p.produto_revestimentos.densidade} />
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
                  {p.produto_revestimentos.sustentabilidade && (
                    <SpecCard icon={<Sparkles className="h-4 w-4" />} label="Sustentabilidade" value={p.produto_revestimentos.sustentabilidade} />
                  )}
                  {p.produto_revestimentos.certificacoes && (
                    <SpecCard icon={<ShieldCheck className="h-4 w-4" />} label="Certificações" value={p.produto_revestimentos.certificacoes} />
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
                  {p.produto_perfis.espessura_aco && (
                    <SpecCard icon={<Layers className="h-4 w-4" />} label="Espessura Aço" value={p.produto_perfis.espessura_aco} />
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
                  {p.produto_parafusos.rendimento_m2 != null && (
                    <SpecCard icon={<BoxSelect className="h-4 w-4" />} label="Rendimento" value={`${p.produto_parafusos.rendimento_m2} un/m²`} />
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
              {classificacaoFogo && !p.produto_revestimentos && (
                <SpecCard
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Classificação Fogo"
                  value={classificacaoFogo}
                />
              )}
            </div>
          </div>
        )}

        {/* Alpha coefficient chart */}
        {alphaData && Object.keys(alphaData).length > 0 && (
          <AlphaChart
            alpha={alphaData}
            nrc={nrcValue}
            classificacaoFogo={classificacaoFogo}
          />
        )}

        {/* Locais de instalação */}
        {p.locais_instalacao.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Locais de Instalação</h2>
            <div className="flex flex-wrap gap-2">
              {p.locais_instalacao.map((local) => (
                <Badge key={local} variant="outline" className="gap-1.5 text-sm py-1.5 px-3">
                  <MapPin className="h-3.5 w-3.5" />
                  {local}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Forma de instalação */}
        {p.forma_instalacao && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Instruções de Uso</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">{p.forma_instalacao}</p>
          </div>
        )}

        {/* Embalagem */}
        {(p.qtd_embalagem || p.peso_embalagem) && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Embalagem</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {p.qtd_embalagem && (
                <SpecCard
                  icon={<BoxSelect className="h-4 w-4" />}
                  label="Qtd. Embalagem"
                  value={`${p.qtd_embalagem} ${p.unidade_embalagem ?? p.unidade}`}
                />
              )}
              {p.peso_embalagem && (
                <SpecCard
                  icon={<BoxSelect className="h-4 w-4" />}
                  label="Peso"
                  value={p.peso_embalagem}
                />
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
