'use client'

/**
 * Error boundary raiz — captura falhas que quebram o próprio root layout.
 * Substitui todo o documento, então NÃO pode depender de globals.css/layout;
 * usa estilos inline para funcionar mesmo se o CSS não carregar.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#fff',
          color: '#111',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 420 }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
            Algo deu errado
          </h1>
          <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Ocorreu um erro inesperado. Recarregue a página para tentar novamente.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '1.5rem',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #111',
              background: '#111',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
