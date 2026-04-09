import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | ISO-GESSO',
  description: 'Saiba como a ISO-GESSO coleta, usa e protege suas informações pessoais.',
}

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidade</h1>
      <p className="text-muted-foreground mb-10">Última atualização: janeiro de 2025</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Informações que coletamos</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Coletamos apenas as informações necessárias para atender sua solicitação de orçamento ou
            contato, como nome, e-mail e telefone. Não coletamos dados de navegação ou informações
            sensíveis sem sua autorização.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Como usamos suas informações</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            As informações fornecidas são utilizadas exclusivamente para responder às suas
            solicitações, enviar orçamentos e manter comunicação comercial pertinente. Não
            compartilhamos seus dados com terceiros sem seu consentimento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Armazenamento e segurança</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Seus dados são armazenados em servidores seguros e protegidos por medidas técnicas
            adequadas. Mantemos as informações pelo tempo necessário para a finalidade informada ou
            conforme exigido por lei.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Seus direitos</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Conforme a LGPD (Lei 13.709/2018), você tem direito a acessar, corrigir ou solicitar a
            exclusão dos seus dados pessoais. Para exercer esses direitos, entre em contato conosco
            pelo e-mail contato@isogesso.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Contato</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Dúvidas sobre esta política? Entre em contato: <strong>contato@isogesso.com</strong>
          </p>
        </section>
      </div>
    </div>
  )
}
