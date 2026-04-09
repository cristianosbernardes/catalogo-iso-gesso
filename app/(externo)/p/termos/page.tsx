import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Serviço | ISO-GESSO',
  description: 'Leia os termos de uso do catálogo de produtos ISO-GESSO.',
}

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Termos de Serviço</h1>
      <p className="text-muted-foreground mb-10">Última atualização: janeiro de 2025</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Uso do catálogo</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Este catálogo é disponibilizado pela ISO-GESSO para consulta de produtos e solicitação
            de orçamentos. O uso é permitido para fins comerciais legítimos, sendo vedada a
            reprodução ou redistribuição do conteúdo sem autorização.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Informações de produtos</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            As especificações técnicas, imagens e descrições são fornecidas a título informativo.
            Preços e disponibilidade de estoque estão sujeitos a alteração sem aviso prévio.
            Confirme sempre com nossa equipe antes de finalizar qualquer pedido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Responsabilidades</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A ISO-GESSO não se responsabiliza por decisões de projeto tomadas exclusivamente com
            base nas informações deste catálogo. Recomendamos consultar nossos técnicos para
            aplicações críticas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Propriedade intelectual</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Todo o conteúdo deste catálogo — incluindo textos, imagens, logotipos e dados técnicos
            — é de propriedade da ISO-GESSO ou de seus fornecedores e está protegido pela
            legislação de propriedade intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Contato</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Dúvidas sobre estes termos? Entre em contato: <strong>contato@isogesso.com</strong>
          </p>
        </section>
      </div>
    </div>
  )
}
