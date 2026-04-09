/**
 * lib/api.ts
 *
 * Cliente HTTP que conecta o catálogo à API do CRM (Cloudflare Workers/Hono).
 *
 * ## Variáveis de ambiente
 * - NEXT_PUBLIC_API_URL  → base da API         (padrão: http://localhost:8787)
 * - NEXT_PUBLIC_CDN_URL  → base do storage R2  (padrão: http://localhost:8787/api/storage)
 *
 * ## Cache (Next.js Data Cache)
 * Todas as chamadas server-side passam por `apiGetPublic`, que usa `next: { revalidate }`.
 * Em desenvolvimento o revalidate é forçado a 0 (sem cache), para que mudanças feitas
 * no CRM apareçam imediatamente sem precisar reiniciar o servidor.
 * Em produção os tempos abaixo se aplicam:
 *
 * | Endpoint                     | revalidate |
 * |------------------------------|------------|
 * | /api/produtos (listagem)     | 60 s       |
 * | /api/produtos/slug/:slug      | 300 s      |
 * | /api/produtos/popular        | 120 s      |
 * | /api/categorias              | 300 s      |
 *
 * ## Normalização
 * A API retorna dados em camelCase com specs aninhados; os componentes esperam
 * snake_case com campos produto_* no nível raiz. `normalizeProduto` faz essa
 * conversão de forma centralizada.
 */

import type { ProdutoBase, PaginatedResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:8787/api/storage'

// Em dev, desativa o cache para refletir mudanças do CRM em tempo real.
const isDev = process.env.NODE_ENV === 'development'

// ---------------------------------------------------------------------------
// Helpers de serialização
// ---------------------------------------------------------------------------

function toSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

function keysToSnake<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map((item) => keysToSnake(item)) as T
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        toSnake(k),
        v !== null && typeof v === 'object' ? keysToSnake(v) : v,
      ])
    ) as T
  }
  return obj as T
}

// ---------------------------------------------------------------------------
// Funções de fetch
// ---------------------------------------------------------------------------

/**
 * Fetch server-side com cache controlado pelo Next.js Data Cache.
 * Em dev: sem cache (revalidate = 0).
 * Em produção: usa o `revalidate` informado pelo chamador.
 */
async function apiGetPublic<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: isDev ? 0 : revalidate },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

/**
 * Fetch client-side (sem cache do Next.js).
 * Usado em hooks React Query para mutações e refetch interativos.
 */
export async function apiClient<T = unknown>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const url = new URL(`${API_URL}${path}`)
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const { params: _, ...fetchOptions } = options || {}
  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers: { 'Content-Type': 'application/json', ...fetchOptions?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `API error ${res.status}` }))
    throw new Error(body.error || `API error ${res.status}`)
  }
  return res.json()
}

// ---------------------------------------------------------------------------
// Normalização de produto
// ---------------------------------------------------------------------------

/**
 * Converte a resposta bruta da API para o formato esperado pelos componentes.
 *
 * A API entrega:
 *   - Chaves em camelCase           → convertidas para snake_case
 *   - Imagens em `imagens`          → mapeadas para `produto_imagens`
 *   - Specs aninhados em `specs.*`  → espalhados em `produto_las`, `produto_placas`, etc.
 *   - Variantes em `variantes`      → mantidas, com chaves convertidas
 *   - Color slugs em `colorSlugs`   → mapeados para `color_slugs`
 */
function normalizeProduto(raw: any): ProdutoBase {
  const p = keysToSnake<any>(raw)

  // A API retorna imagens em "imagens", front espera "produto_imagens"
  if (raw.imagens && !p.produto_imagens) {
    p.produto_imagens = raw.imagens.map((img: any) => keysToSnake<any>(img))
  }

  // A API retorna specs como { la, placa, perfil, parafuso, acessorio, revestimento }
  // Front espera produto_las, produto_placas, produto_perfis, etc.
  if (raw.specs) {
    if (raw.specs.la) p.produto_las = keysToSnake(raw.specs.la)
    if (raw.specs.placa) p.produto_placas = keysToSnake(raw.specs.placa)
    if (raw.specs.perfil) p.produto_perfis = keysToSnake(raw.specs.perfil)
    if (raw.specs.parafuso) p.produto_parafusos = keysToSnake(raw.specs.parafuso)
    if (raw.specs.acessorio) p.produto_acessorios = keysToSnake(raw.specs.acessorio)
    if (raw.specs.revestimento) p.produto_revestimentos = keysToSnake(raw.specs.revestimento)
  }

  // Variantes
  if (raw.variantes && !p.variantes) {
    p.variantes = raw.variantes.map((v: any) => keysToSnake<any>(v))
  }

  // Color slugs
  if (raw.colorSlugs) {
    p.color_slugs = raw.colorSlugs
  }

  return p as ProdutoBase
}

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------

export interface Categoria {
  id: string
  nome: string
  descricao: string
  icon_key: string
  ordem: number
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export const api = {
  catalogo: {
    /** Lista todos os produtos públicos (revalidate 60 s em produção). */
    listar: async () => {
      const res = await apiGetPublic<PaginatedResponse<any>>('/api/produtos?publico=true&limit=9999', 60)
      return (res.data || []).map((p: any) => normalizeProduto(p))
    },
    /** Busca um produto pelo slug público (revalidate 300 s em produção). */
    buscar: async (slug: string) => {
      const raw = await apiGetPublic<any>(`/api/produtos/slug/${slug}`)
      return normalizeProduto(raw)
    },
    /** Retorna os produtos mais populares (revalidate 120 s em produção). */
    populares: async (limit = 12) => {
      const raw = await apiGetPublic<any[]>(`/api/produtos/popular?limit=${limit}`, 120)
      return (raw || []).map((p: any) => normalizeProduto(p))
    },
  },
  categorias: {
    /** Lista todas as categorias (revalidate 300 s em produção). */
    listar: async () => {
      const raw = await apiGetPublic<any[]>('/api/categorias', 300)
      return (raw || []).map((c: any) => keysToSnake<Categoria>(c))
    },
  },
}
