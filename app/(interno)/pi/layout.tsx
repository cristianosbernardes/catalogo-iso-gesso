import { CatalogProvider } from '@/contexts/catalog-context'

export default function InternoLayout({ children }: { children: React.ReactNode }) {
  return <CatalogProvider prefix="/pi">{children}</CatalogProvider>
}
