import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato | ISO-GESSO',
  description:
    'Entre em contato com a ISO-GESSO para orçamentos, dúvidas técnicas ou suporte em isolamento acústico.',
}

export default function ContatoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Contato</h1>
      <p className="text-muted-foreground mb-10">
        Entre em contato conosco para orçamentos, dúvidas técnicas ou suporte.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4 text-primary" /> Telefone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Ligue para nós</p>
            <p className="font-semibold mt-1">(11) 4321-0000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" /> E-mail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Envie sua mensagem</p>
            <p className="font-semibold mt-1">contato@isogesso.com</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" /> Endereço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Visite nosso escritório</p>
            <p className="font-semibold mt-1">São Paulo, SP — Brasil</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
          <Button size="lg">Chamar no WhatsApp</Button>
        </a>
      </div>
    </div>
  )
}
