import Link from 'next/link'
import { PackageX } from 'lucide-react'

/**
 * Página 404 custom — substitui o default do Next. Usada quando `notFound()`
 * é chamado (ex.: slug de produto inexistente) ou uma rota não casa.
 *
 * Server Component: por isso o botão usa classes inline (equivalentes ao
 * Button default) em vez de `buttonVariants()`, que vive num módulo "use client"
 * e não pode ser invocado do servidor.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <PackageX className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h1 className="text-lg font-semibold text-foreground">Página não encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        O produto ou página que você procura não existe ou foi movido.
      </p>
      <Link
        href="/p/produtos"
        className="mt-6 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
      >
        Ver catálogo
      </Link>
    </div>
  )
}
