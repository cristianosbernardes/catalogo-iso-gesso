'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Error boundary de segmento — captura falhas de renderização/carregamento
 * (ex.: API fora do ar ao buscar produtos). Diferencia "erro" de "catálogo
 * vazio": aqui mostramos uma UI de erro com retry; o estado vazio real
 * ("Nenhum produto encontrado") continua no componente de listagem.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[catalogo] erro de renderização:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h1 className="text-lg font-semibold text-foreground">
        Não foi possível carregar o catálogo
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Tivemos um problema ao buscar os produtos. Isso costuma ser temporário —
        tente novamente em instantes.
      </p>
      <Button onClick={() => reset()} className="mt-6">
        Tentar novamente
      </Button>
    </div>
  )
}
