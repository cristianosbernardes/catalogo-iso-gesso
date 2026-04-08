# Catálogo ISO-GESSO

## Visão Geral
Aplicação Next.js standalone que exibe o catálogo de produtos acústicos da ISO-GESSO.
Consome a mesma API do CRM (`crm-iso-gesso/api`) — não possui backend próprio.

## Rotas Públicas vs Internas

O catálogo possui **dois contextos de visualização** que compartilham os mesmos dados
da API, mas diferem no que é exibido ao usuário:

### `/p/` — Catálogo Externo (público)
- Destinado a **clientes finais** e visitantes
- **NÃO exibe preços** (nem do produto base, nem de variantes)
- Exibe: nome, SKU, categoria, imagens, especificações técnicas, cores, locais de instalação
- CTA: "Solicitar Orçamento" → direciona para `/p/contato`
- Indexável por buscadores (SEO ativo)

### `/pi/` — Catálogo Interno (equipe)
- Destinado à **equipe interna** (vendedores, representantes)
- **Exibe preços** do produto e de cada variante
- Exibe: tudo que o externo exibe + preços + estoque
- CTA: pode incluir ações internas além do orçamento
- NÃO indexável por buscadores (noindex)

### Regras de implementação
1. A distinção é **100% frontend** — a API retorna todos os dados sempre
2. O prefixo (`/p/` ou `/pi/`) é propagado via React Context (`CatalogContext`)
3. Todos os links internos da aplicação devem preservar o prefixo da rota atual
4. Componentes usam `useCatalogContext()` para decidir o que renderizar
5. A rota raiz `/` redireciona para `/p/produtos` (padrão externo)

### Estrutura de rotas
```
app/
  page.tsx                         → redirect para /p/produtos
  (externo)/p/                     → layout com contexto externo
    produtos/page.tsx              → listagem sem preços
    produtos/[slug]/page.tsx       → detalhe sem preços
    favoritos/page.tsx
    contato/page.tsx
  (interno)/pi/                    → layout com contexto interno
    produtos/page.tsx              → listagem com preços
    produtos/[slug]/page.tsx       → detalhe com preços
    favoritos/page.tsx
    contato/page.tsx
```

## Stack
- Next.js 16 (App Router)
- React 19
- TailwindCSS 4
- Framer Motion
- React Query (TanStack)
- API: Cloudflare Workers (Hono)
