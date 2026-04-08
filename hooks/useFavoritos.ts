'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'iso-gesso-favoritos'

export interface FavoritoItem {
  productId: string
  slug: string
  nome: string
  categoria: string
  preco: number
  imageUrl?: string
  addedAt: string
}

function readFavoritos(): FavoritoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeFavoritos(items: FavoritoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>(readFavoritos)

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavoritos(readFavoritos())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const isFavorito = useCallback(
    (productId: string) => favoritos.some((f) => f.productId === productId),
    [favoritos]
  )

  const toggleFavorito = useCallback(
    (item: FavoritoItem) => {
      setFavoritos((prev) => {
        const exists = prev.some((f) => f.productId === item.productId)
        const next = exists
          ? prev.filter((f) => f.productId !== item.productId)
          : [...prev, { ...item, addedAt: new Date().toISOString() }]
        writeFavoritos(next)
        return next
      })
    },
    []
  )

  const removeFavorito = useCallback((productId: string) => {
    setFavoritos((prev) => {
      const next = prev.filter((f) => f.productId !== productId)
      writeFavoritos(next)
      return next
    })
  }, [])

  const clearFavoritos = useCallback(() => {
    writeFavoritos([])
    setFavoritos([])
  }, [])

  return { favoritos, isFavorito, toggleFavorito, removeFavorito, clearFavoritos, count: favoritos.length }
}
