import type { ProdutoBase } from '@/types'

/**
 * Formata um número no padrão monetário brasileiro.
 * Usa Intl.NumberFormat diretamente para garantir consistência em SSR e client.
 * Exemplo: 58 → "R$ 58,00" | 1234.5 → "R$ 1.234,50"
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

/**
 * Resolve o preço a exibir no card de listagem de produto.
 *
 * Regra (documentada):
 * 1. A imagem principal é a de menor `ordem` entre `produto_imagens`.
 * 2. Se essa imagem possui `cor` definida, busca a primeira variante ativa
 *    com aquela cor e retorna o seu preço.
 * 3. Se a imagem principal não tem `cor`, retorna o preço da primeira
 *    variante ativa (pela ordem de cadastro — `created_at` crescente).
 * 4. Se o produto não possui variantes ativas, retorna `p.preco` (base).
 * 5. Nunca retorna `null` — o mínimo é `0`.
 */
export function resolveCardPrice(p: ProdutoBase): number {
  const activeVariants = (p.variantes ?? []).filter((v) => v.ativo)

  if (activeVariants.length === 0) return p.preco ?? 0

  const mainImage = (p.produto_imagens ?? []).slice().sort((a, b) => a.ordem - b.ordem)[0]

  if (mainImage?.cor) {
    const variantForColor = activeVariants.find((v) => v.cor === mainImage.cor)
    if (variantForColor) return variantForColor.preco ?? 0
  }

  // Sem cor na imagem principal → primeira variante ativa por created_at
  const sorted = activeVariants.slice().sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  return sorted[0].preco ?? 0
}

/**
 * Espelha `resolveCardPrice` para devolver a unidade do preço (m², m³,
 * metro linear, un). Default `'m²'` (mesmo default do CRM).
 */
export function resolveCardUnidade(p: ProdutoBase): string {
  const activeVariants = (p.variantes ?? []).filter((v) => v.ativo)
  const fallback = p.unidade_preco || 'm²'

  if (activeVariants.length === 0) return fallback

  const mainImage = (p.produto_imagens ?? []).slice().sort((a, b) => a.ordem - b.ordem)[0]

  if (mainImage?.cor) {
    const variantForColor = activeVariants.find((v) => v.cor === mainImage.cor)
    if (variantForColor) return variantForColor.unidade_preco || fallback
  }

  const sorted = activeVariants.slice().sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  return sorted[0].unidade_preco || fallback
}
