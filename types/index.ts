// ── Produtos ──

export interface ProdutoBase {
  id: string
  nome: string
  sku: string
  categoria: string
  estoque: number
  unidade: string
  preco: number
  especificacao: string | null
  classificacao_fogo: string | null
  cores: string[]
  qtd_embalagem: number | null
  unidade_embalagem: string | null
  peso_embalagem: string | null
  locais_instalacao: string[]
  forma_instalacao: string | null
  dimensoes: Record<string, string>
  public_slug: string | null
  public_share_url: string | null
  qr_code_svg_path: string | null
  qr_code_webp_path: string | null
  is_public: boolean
  estoque_minimo: number | null
  deleted_at: string | null
  notificar_whatsapp: boolean
  qr_generated_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  produto_las?: ProdutoLa | null
  produto_perfis?: ProdutoPerfil | null
  produto_parafusos?: ProdutoParafuso | null
  produto_placas?: ProdutoPlaca | null
  produto_acessorios?: ProdutoAcessorio | null
  produto_revestimentos?: ProdutoRevestimento | null
  produto_imagens?: ProdutoImagem[]
  selected_color?: string | null
  color_slugs?: Record<string, string>
  variantes?: ProdutoVariante[]
  selected_variante?: ProdutoVariante | null
}

export interface ProdutoVariante {
  id: string
  produto_id: string
  cor: string
  atributos: Record<string, string>
  sku: string | null
  preco: number
  estoque: number
  estoque_minimo: number | null
  slug: string | null
  padrao: boolean
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface ProdutoLa {
  id: string
  produto_id: string
  densidade: string | null
  espessura: string | null
  resistencia_termica: string | null
  nrc: string | null
  alpha_coefficients: Record<string, number>
}

export interface ProdutoPerfil {
  id: string
  produto_id: string
  tipo: string | null
  largura: string | null
  comprimento: string | null
  espessura_aco: string | null
  acabamento: string | null
}

export interface ProdutoParafuso {
  id: string
  produto_id: string
  tipo: string | null
  diametro: string | null
  comprimento: string | null
  material: string | null
  rendimento_m2: number | null
}

export interface ProdutoPlaca {
  id: string
  produto_id: string
  tipo: string | null
  espessura: string | null
  dimensao: string | null
  peso: string | null
  nrc: string | null
  borda_modelo: string | null
  alpha_coefficients?: Record<string, number> | null
}

export interface ProdutoRevestimento {
  id: string
  produto_id: string
  material: string | null
  acabamento: string | null
  formato: string | null
  composicao: string | null
  classificacao_fogo: string | null
  nrc: string | null
  alpha_coefficients?: Record<string, number> | null
  densidade: string | null
  espessuras: string | null
  tipo_fixacao: string | null
  sustentabilidade: string | null
  certificacoes: string | null
  padrao_instalacao: string | null
}

export interface ProdutoAcessorio {
  id: string
  produto_id: string
  tipo: string | null
  aplicacao: string | null
  rendimento: string | null
}

export interface ProdutoImagem {
  id: string
  produto_id: string
  storage_path: string
  url: string
  ordem: number
  cor: string | null
  created_at: string
}

// ── Respostas paginadas da API ──

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
}
