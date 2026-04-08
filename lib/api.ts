const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:8787/api/storage'

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

async function apiGetPublic<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

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

import type { ProdutoBase, PaginatedResponse } from '@/types'

export const api = {
  catalogo: {
    listar: async () => {
      const res = await apiGetPublic<PaginatedResponse<any>>('/api/produtos?publico=true&limit=9999', 60)
      return (res.data || []).map((p: any) => keysToSnake<ProdutoBase>(p))
    },
    buscar: async (slug: string) => {
      const raw = await apiGetPublic<any>(`/api/produtos/slug/${slug}`)
      return keysToSnake<ProdutoBase>(raw)
    },
  },
}
