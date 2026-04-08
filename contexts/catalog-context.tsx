'use client'

import { createContext, useContext } from 'react'

interface CatalogContextValue {
  /** Prefixo da rota atual: "/p" (externo) ou "/pi" (interno) */
  prefix: '/p' | '/pi'
  /** true quando a rota é interna (/pi/) — exibe preços e estoque */
  isInternal: boolean
}

const CatalogContext = createContext<CatalogContextValue>({
  prefix: '/p',
  isInternal: false,
})

export function CatalogProvider({
  children,
  prefix,
}: {
  children: React.ReactNode
  prefix: '/p' | '/pi'
}) {
  return (
    <CatalogContext.Provider value={{ prefix, isInternal: prefix === '/pi' }}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalogContext() {
  return useContext(CatalogContext)
}
