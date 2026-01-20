import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

/**
 * Design: Minimalismo Botânico Contemporâneo
 * Página de Contato com formulário funcional
 */

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const sendMessageMutation = trpc.contact.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar mensagem. Tente novamente.");
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <a href="/">
              <img
                src="/images/logo_milena.png"
                alt="Milena Arte e Cheiro"
                className="h-12 w-auto"
              />
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#produtos" className="text-foreground hover:text-primary transition-colors">
              Produtos
            </a>
            <a href="/#sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="/contact" className="text-primary font-semibold">
              Contato
            </a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-foreground">
            <a href="/">Voltar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl text-center">
          <h1 className="text-5xl lg:text-6xl text-foreground mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-foreground/70">
            Tem dúvidas sobre nossos produtos? Quer fazer um pedido especial? 
            Estamos aqui para ajudar!
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl text-foreground mb-6">Informações de Contato</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">E-mail</h3>
                    <a
                      href="mailto:milena.maaf@gmail.com"
                      className="text-foreground/70 hover:text-primary transition-colors"
                    >
                      milena.maaf@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MessageCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/5561991479201?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20seus%20produtos%20artesanais."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      Clique aqui para conversar
                      <span className="text-sm">→</span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Localização</h3>
                    <p className="text-foreground/70">
                      Milena Arte & Cheiro Ltda
                      <br />
                      Águas Claras
                      <br />
                      Brasília - DF
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">Horário de Atendimento</h3>
                <p className="text-sm text-foreground/70">
                  Segunda a Sexta: 9h às 18h
                  <br />
                  Sábado: 10h às 14h
                  <br />
                  Domingo: Fechado
                </p>
              </div>
              
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
                asChild
              >
                <a
                  href="https://wa.me/5561991479201?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20seus%20produtos%20artesanais."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contato via WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo *
                </label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  {...register("name")}
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Telefone (Opcional)
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    {...register("phone")}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Assunto *
                </label>
                <Input
                  id="subject"
                  placeholder="Qual é o assunto da sua mensagem?"
                  {...register("subject")}
                  className="w-full"
                />
                {errors.subject && (
                  <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensagem *
                </label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem aqui..."
                  rows={6}
                  {...register("message")}
                  className="w-full"
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-foreground px-8 py-3"
                >
                  {sendMessageMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="border-border hover:bg-muted px-8 py-3"
                >
                  Limpar
                </Button>
              </div>

              <p className="text-sm text-foreground/50">
                * Campos obrigatórios. Responderemos sua mensagem em até 24 horas.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl lg:text-5xl text-foreground mb-6">
            Prefere Explorar Primeiro?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Conheça nossa coleção completa de sabões e velas artesanais.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-foreground px-10 py-6 text-base">
            <a href="/">Voltar para Home</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Milena Arte e Cheiro</h4>
              <p className="text-sm text-foreground/60">
                Sabões e velas artesanais feitos com amor e dedicação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="/#produtos" className="hover:text-primary transition-colors">
                    Produtos
                  </a>
                </li>
                <li>
                  <a href="/#sobre" className="hover:text-primary transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-primary transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <p className="text-sm text-foreground/60">
                Email: milena.maaf@gmail.com
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-foreground/50">
              © 2026 Milena Arte e Cheiro Ltda. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
