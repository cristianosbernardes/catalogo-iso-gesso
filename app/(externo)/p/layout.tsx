import { CatalogProvider } from '@/contexts/catalog-context'

export default function ExternoLayout({ children }: { children: React.ReactNode }) {
  return <CatalogProvider prefix="/p">{children}</CatalogProvider>
}
